'use client';

import { useState } from 'react';
import { Save, Check, FileText } from 'lucide-react';

interface NotesEditorProps {
  userId?: string;
  topicId: string;
  topicTitle?: string;
  initialContent?: string;
  onSave?: (content: string) => void;
}

export default function NotesEditor({
  userId = 'default-user',
  topicId,
  topicTitle = 'Topic Note',
  initialContent = '',
  onSave,
}: NotesEditorProps) {
  const [content, setContent] = useState(initialContent || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (onSave) {
        onSave(content);
      }

      await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, topicId, content }),
      }).catch(() => {
        // Fallback
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error('Failed to save note:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-[#0f172a] border-2 border-slate-700 rounded-none p-5 text-slate-100 shadow-2xl">
      <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-lime-400" />
          <span className="text-xs font-bold text-slate-300">
            Notes for: <span className="text-white font-black">{topicTitle}</span>
          </span>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-none text-xs font-black bg-[#67E14B] hover:bg-lime-300 text-black transition disabled:opacity-50 shadow-md"
        >
          {saved ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Note'}</span>
            </>
          )}
        </button>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write key takeaways, insights, project implementations, or links..."
        rows={5}
        className="w-full bg-[#090d16] border-2 border-slate-700 focus:border-[#67E14B] rounded-none p-3.5 text-xs text-white placeholder-slate-500 focus:outline-none font-mono resize-y leading-relaxed"
      />
      <div className="flex justify-between items-center mt-2.5 text-xs text-slate-400 font-semibold">
        <span>Supports markdown & bullet points</span>
        <span className="text-lime-400 font-mono">{content.length} characters</span>
      </div>
    </div>
  );
}
