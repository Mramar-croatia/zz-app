import { useState } from 'react';
import { Eye, Copy, Check, Clipboard, Phone } from 'lucide-react';

/**
 * Quick action buttons for volunteer row/card
 */
export default function QuickActions({ volunteer, onViewProfile, compact = false }) {
  const [copied, setCopied] = useState(false);
  const [copiedRow, setCopiedRow] = useState(false);

  const copyPhone = async e => {
    e.stopPropagation();
    if (volunteer?.phone) {
      await navigator.clipboard.writeText(volunteer.phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyRowData = async e => {
    e.stopPropagation();
    const text = `${volunteer.name}\n${volunteer.school} - ${volunteer.grade}. razred\nTelefon: ${volunteer.phone}\nLokacije: ${volunteer.locations?.join(', ') || '-'}\nSati: ${volunteer.hours}`;
    await navigator.clipboard.writeText(text);
    setCopiedRow(true);
    setTimeout(() => setCopiedRow(false), 2000);
  };

  const handleViewProfile = e => {
    e.stopPropagation();
    onViewProfile(volunteer);
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={handleViewProfile}
          className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
          title="Pogledaj profil"
        >
          <Eye className="w-5 h-5 text-surface-400 hover:text-brand-purple" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        onClick={handleViewProfile}
        className="p-2 hover:bg-brand-purple/10 rounded-lg transition-colors"
        title="Pogledaj profil"
      >
        <Eye className="w-5 h-5 text-surface-400 hover:text-brand-purple" />
      </button>
      <button
        onClick={copyRowData}
        className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
        title="Kopiraj podatke"
      >
        {copiedRow ? (
          <Check className="w-5 h-5 text-emerald-500" />
        ) : (
          <Clipboard className="w-5 h-5 text-surface-400 hover:text-surface-600" />
        )}
      </button>
      <button
        onClick={copyPhone}
        className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
        title="Kopiraj broj"
      >
        {copied ? (
          <Check className="w-5 h-5 text-emerald-500" />
        ) : (
          <Copy className="w-5 h-5 text-surface-400 hover:text-surface-600" />
        )}
      </button>
      <a
        href={`tel:${volunteer.phone}`}
        onClick={e => e.stopPropagation()}
        className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
        title="Nazovi"
      >
        <Phone className="w-5 h-5 text-surface-400 hover:text-emerald-600" />
      </a>
    </div>
  );
}
