import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

export default function CodeBlock({ code, language = '' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group rounded-xl overflow-hidden border border-[#EAE5DD] dark:border-[#383530] bg-[#1E1D1A] text-[#EDE8E1] shadow-xs">
      <div className="flex items-center justify-between px-4 py-2 bg-[#181715] border-b border-[#2C2A26] text-[11px] text-[#9A9387] font-mono">
        <span>{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] text-[#B8B2A7] hover:text-[#EDE8E1] hover:bg-[#2A2925] transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#4E8752]" />
              <span className="text-[#4E8752]">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 text-xs font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed text-[#EDE8E1] selection:bg-[#5F2B1B]">
        {code}
      </pre>
    </div>
  )
}
