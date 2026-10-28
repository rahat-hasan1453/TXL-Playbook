'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { EditorContent, useEditor, type Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { Placeholder } from '@tiptap/extensions';
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListChecks,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  SquareCode,
  Strikethrough,
  Type,
  Underline,
  Undo2,
} from 'lucide-react';
import { noteToHtml } from '@/lib/note-content';

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_IMAGE_WIDTH = 1400;

function baseExtensions() {
  return [
    StarterKit.configure({
      heading: { levels: [1, 2, 3] },
      link: { openOnClick: false, autolink: true, defaultProtocol: 'https', HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' } },
    }),
    Image.configure({ allowBase64: true }),
    TaskList,
    TaskItem.configure({ nested: true }),
  ];
}

/** Reads an image file as a data URL, downscaling large photos so notes stay light. */
async function imageFileToDataUrl(file: File): Promise<string> {
  if (file.size > MAX_IMAGE_BYTES) throw new Error('Image is larger than 8 MB');
  const raw = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
  if (file.type === 'image/gif' || file.type === 'image/svg+xml' || file.size < 300 * 1024) return raw;

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new window.Image();
    el.onload = () => resolve(el);
    el.onerror = reject;
    el.src = raw;
  });
  const scale = Math.min(1, MAX_IMAGE_WIDTH / img.naturalWidth);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.naturalWidth * scale);
  canvas.height = Math.round(img.naturalHeight * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) return raw;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const type = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
  const compressed = canvas.toDataURL(type, 0.85);
  return compressed.length < raw.length ? compressed : raw;
}

function insertImageFiles(editor: Editor, files: File[], onError: (msg: string) => void) {
  files
    .filter((f) => f.type.startsWith('image/'))
    .forEach((file) => {
      imageFileToDataUrl(file)
        .then((src) => editor.chain().focus().setImage({ src, alt: file.name }).run())
        .catch((err) => onError(err instanceof Error ? err.message : 'Could not add image'));
    });
}

interface SlashCommand {
  key: string;
  label: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
  run: (editor: Editor) => void;
}

const SLASH_COMMANDS: SlashCommand[] = [
  { key: 'text', label: 'Text', hint: 'Plain paragraph', icon: Type, run: (e) => e.chain().focus().setParagraph().run() },
  { key: 'h1', label: 'Heading 1', hint: 'Big section heading', icon: Heading1, run: (e) => e.chain().focus().setHeading({ level: 1 }).run() },
  { key: 'h2', label: 'Heading 2', hint: 'Medium heading', icon: Heading2, run: (e) => e.chain().focus().setHeading({ level: 2 }).run() },
  { key: 'h3', label: 'Heading 3', hint: 'Small heading', icon: Heading3, run: (e) => e.chain().focus().setHeading({ level: 3 }).run() },
  { key: 'bullet', label: 'Bulleted list', hint: 'Simple list', icon: List, run: (e) => e.chain().focus().toggleBulletList().run() },
  { key: 'numbered', label: 'Numbered list', hint: 'Ordered steps', icon: ListOrdered, run: (e) => e.chain().focus().toggleOrderedList().run() },
  { key: 'todo', label: 'To-do list', hint: 'Checklist', icon: ListChecks, run: (e) => e.chain().focus().toggleTaskList().run() },
  { key: 'quote', label: 'Quote', hint: 'Call out a passage', icon: Quote, run: (e) => e.chain().focus().toggleBlockquote().run() },
  { key: 'code', label: 'Code block', hint: 'Snippet or prompt', icon: SquareCode, run: (e) => e.chain().focus().toggleCodeBlock().run() },
  { key: 'divider', label: 'Divider', hint: 'Horizontal line', icon: Minus, run: (e) => e.chain().focus().setHorizontalRule().run() },
];

const IMAGE_COMMAND_KEY = 'image';

interface SlashState {
  query: string;
  from: number;
  to: number;
  top: number;
  left: number;
}

function ToolbarButton({
  onClick,
  active,
  title,
  disabled,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`p-1.5 rounded-md transition disabled:opacity-30 ${
        active ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
      }`}
    >
      {children}
    </button>
  );
}

interface RichNoteEditorProps {
  initialContent?: string;
  placeholder?: string;
  onChange: (html: string) => void;
}

export default function RichNoteEditor({
  initialContent = '',
  placeholder = "Write your takeaways… Type '/' for headings, lists, images and more",
  onChange,
}: RichNoteEditorProps) {
  const [slash, setSlash] = useState<SlashState | null>(null);
  const [slashIndex, setSlashIndex] = useState(0);
  const [linkDraft, setLinkDraft] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const slashRef = useRef<{ state: SlashState | null; index: number; items: SlashCommand[] }>({
    state: null,
    index: 0,
    items: [],
  });
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const filteredCommands = useCallback((query: string) => {
    const q = query.toLowerCase();
    const all: SlashCommand[] = [
      ...SLASH_COMMANDS,
      {
        key: IMAGE_COMMAND_KEY,
        label: 'Image',
        hint: 'Upload from your device',
        icon: ImagePlus,
        run: () => fileInputRef.current?.click(),
      },
    ];
    return q ? all.filter((c) => c.label.toLowerCase().includes(q) || c.key.includes(q)) : all;
  }, []);

  const updateSlash = useCallback(
    (editor: Editor) => {
      const { selection } = editor.state;
      const { $from } = selection;
      if (!selection.empty || $from.parent.type.name === 'codeBlock') {
        setSlash(null);
        return;
      }
      const textBefore = $from.parent.textBetween(0, $from.parentOffset, undefined, '￼');
      const match = /(?:^|\s)\/([a-zA-Z0-9]*)$/.exec(textBefore);
      if (!match) {
        setSlash(null);
        return;
      }
      const slashLength = match[1].length + 1;
      const coords = editor.view.coordsAtPos($from.pos);
      setSlash((prev) => {
        if (!prev || prev.query !== match[1]) setSlashIndex(0);
        return { query: match[1], from: $from.pos - slashLength, to: $from.pos, top: coords.bottom + 6, left: coords.left };
      });
    },
    []
  );

  const runSlashCommand = useCallback((editor: Editor, command: SlashCommand) => {
    const state = slashRef.current.state;
    if (state) editor.chain().focus().deleteRange({ from: state.from, to: state.to }).run();
    setSlash(null);
    command.run(editor);
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [...baseExtensions(), Placeholder.configure({ placeholder })],
    content: noteToHtml(initialContent),
    editorProps: {
      attributes: { class: 'note-content focus:outline-none min-h-[280px] px-1' },
      handleKeyDown: (_view, event) => {
        const { state, index, items } = slashRef.current;
        if (!state || !items.length) return false;
        if (event.key === 'ArrowDown') {
          setSlashIndex((index + 1) % items.length);
          return true;
        }
        if (event.key === 'ArrowUp') {
          setSlashIndex((index - 1 + items.length) % items.length);
          return true;
        }
        if (event.key === 'Enter') {
          if (editorRef.current) runSlashCommand(editorRef.current, items[index]);
          return true;
        }
        if (event.key === 'Escape') {
          setSlash(null);
          return true;
        }
        return false;
      },
      handlePaste: (_view, event) => {
        const files = Array.from(event.clipboardData?.files || []).filter((f) => f.type.startsWith('image/'));
        if (!files.length || !editorRef.current) return false;
        insertImageFiles(editorRef.current, files, setImageError);
        return true;
      },
      handleDrop: (_view, event, _slice, moved) => {
        if (moved) return false;
        const files = Array.from((event as DragEvent).dataTransfer?.files || []).filter((f) => f.type.startsWith('image/'));
        if (!files.length || !editorRef.current) return false;
        event.preventDefault();
        insertImageFiles(editorRef.current, files, setImageError);
        return true;
      },
    },
    onUpdate: ({ editor }) => {
      onChangeRef.current(editor.getHTML());
      updateSlash(editor);
    },
    onSelectionUpdate: ({ editor }) => updateSlash(editor),
    onBlur: () => setTimeout(() => setSlash(null), 150),
  });

  const editorRef = useRef<Editor | null>(null);
  editorRef.current = editor;

  const slashItems = slash ? filteredCommands(slash.query) : [];
  slashRef.current = { state: slash, index: slashIndex, items: slashItems };

  useEffect(() => {
    if (slash && slashItems.length === 0) setSlash(null);
  }, [slash, slashItems.length]);

  const applyLink = () => {
    if (!editor || linkDraft === null) return;
    const href = linkDraft.trim();
    if (!href) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: /^[a-z]+:/i.test(href) ? href : `https://${href}` }).run();
    }
    setLinkDraft(null);
  };

  if (!editor) {
    return <div className="min-h-[320px] rounded-xl bg-[#0a0a0c] border border-zinc-800 animate-pulse" />;
  }

  return (
    <div className="relative">
      {/* Block toolbar */}
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 mb-3 p-1 rounded-lg bg-[#0a0a0c] border border-zinc-800">
        <ToolbarButton title="Heading 1" active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
          <Heading1 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton title="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton title="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton title="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <span className="w-px h-5 bg-zinc-800 mx-1" />
        <ToolbarButton title="Bulleted list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton title="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton title="To-do list" active={editor.isActive('taskList')} onClick={() => editor.chain().focus().toggleTaskList().run()}>
          <ListChecks className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton title="Quote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton title="Code block" active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          <SquareCode className="w-4 h-4" />
        </ToolbarButton>
        <span className="w-px h-5 bg-zinc-800 mx-1" />
        <ToolbarButton title="Add link" active={editor.isActive('link')} onClick={() => setLinkDraft(editor.getAttributes('link').href || '')}>
          <Link2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton title="Add image" onClick={() => fileInputRef.current?.click()}>
          <ImagePlus className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton title="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus className="w-4 h-4" />
        </ToolbarButton>
        <span className="flex-1" />
        <ToolbarButton title="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
          <Undo2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton title="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
          <Redo2 className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {linkDraft !== null && (
        <div className="flex items-center gap-2 mb-3">
          <input
            autoFocus
            value={linkDraft}
            onChange={(e) => setLinkDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') applyLink();
              if (e.key === 'Escape') setLinkDraft(null);
            }}
            placeholder="Paste a link, e.g. https://txlplaybook.netlify.app"
            className="flex-1 bg-[#0a0a0c] border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500"
          />
          <button onClick={applyLink} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-black hover:bg-zinc-200">
            Apply
          </button>
          <button onClick={() => setLinkDraft(null)} className="px-2 py-1.5 text-xs text-zinc-400 hover:text-white">
            Cancel
          </button>
        </div>
      )}

      {/* Inline formatting on text selection */}
      <BubbleMenu
        editor={editor}
        shouldShow={({ editor: e, state }) => !state.selection.empty && !e.isActive('image') && !e.isActive('codeBlock')}
        className="flex items-center gap-0.5 p-1 rounded-lg bg-[#18191d] border border-zinc-700 shadow-2xl"
      >
        <ToolbarButton title="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Underline" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <Underline className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Strikethrough" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <Strikethrough className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Inline code" active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()}>
          <Code className="w-3.5 h-3.5" />
        </ToolbarButton>
        <ToolbarButton title="Link" active={editor.isActive('link')} onClick={() => setLinkDraft(editor.getAttributes('link').href || '')}>
          <Link2 className="w-3.5 h-3.5" />
        </ToolbarButton>
      </BubbleMenu>

      <EditorContent editor={editor} />

      {/* Slash command menu */}
      {slash && slashItems.length > 0 && (
        <div
          className="fixed z-[70] w-64 max-h-72 overflow-y-auto p-1 rounded-xl bg-[#18191d] border border-zinc-700 shadow-2xl"
          style={{ top: Math.min(slash.top, window.innerHeight - 300), left: Math.min(slash.left, window.innerWidth - 270) }}
        >
          <p className="px-2 pt-1 pb-1.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">Blocks</p>
          {slashItems.map((cmd, i) => {
            const Icon = cmd.icon;
            return (
              <button
                key={cmd.key}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  runSlashCommand(editor, cmd);
                }}
                onMouseEnter={() => setSlashIndex(i)}
                className={`w-full flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-left transition ${
                  i === slashIndex ? 'bg-zinc-800' : ''
                }`}
              >
                <span className="w-8 h-8 rounded-md bg-[#0a0a0c] border border-zinc-800 flex items-center justify-center text-zinc-300">
                  <Icon className="w-4 h-4" />
                </span>
                <span>
                  <span className="block text-xs font-medium text-zinc-100">{cmd.label}</span>
                  <span className="block text-[10px] text-zinc-500">{cmd.hint}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          insertImageFiles(editor, Array.from(e.target.files || []), setImageError);
          e.target.value = '';
        }}
      />
      {imageError && <p className="mt-2 text-xs text-red-400">{imageError}</p>}
    </div>
  );
}

/** Read-only rendering of a saved note. Goes through the editor schema, so stray HTML is dropped. */
export function NoteViewer({ content, className = '' }: { content: string; className?: string }) {
  const editor = useEditor({
    immediatelyRender: false,
    editable: false,
    extensions: baseExtensions(),
    content: noteToHtml(content),
    editorProps: { attributes: { class: `note-content note-content--compact ${className}` } },
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== noteToHtml(content)) {
      editor.commands.setContent(noteToHtml(content), { emitUpdate: false });
    }
  }, [editor, content]);

  return <EditorContent editor={editor} />;
}
