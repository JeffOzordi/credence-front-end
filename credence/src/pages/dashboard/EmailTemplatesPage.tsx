import { useMemo, useState } from 'react'
import { useEmailTemplates, useSaveEmailTemplates } from '../../features/emailTemplates/hooks/useEmailTemplates.ts'
import type { EmailTemplate } from '../../features/emailTemplates/data/emailTemplates.ts'

function renderPreview(template: EmailTemplate) {
  return template.subject
    .replaceAll('{{invoice_number}}', 'INV-2291')
    .replaceAll('{{outstanding_balance}}', '₦1,200,000')
    .replaceAll('{{debtor_name}}', 'Bright Foods Ltd')
    .replaceAll('{{business_name}}', 'Danest Stores Ltd')
    .replaceAll('{{transaction_amount}}', '₦1,200,000')
    .replaceAll('{{amount_paid}}', '₦0')
    .replaceAll('{{due_date}}', '24 Oct')
    .replaceAll('{{payment_link}}', 'Pay securely')
}

export function EmailTemplatesPage() {
  const templates = useEmailTemplates()
  const saveTemplates = useSaveEmailTemplates()
  const [selectedId, setSelectedId] = useState('')
  const [draft, setDraft] = useState<EmailTemplate | null>(null)

  const selectedTemplate = useMemo(
    () => (templates.data ?? []).find((template) => template.id === selectedId) ?? templates.data?.[0],
    [selectedId, templates.data],
  )
  const activeTemplate = draft ?? selectedTemplate ?? null

  function selectTemplate(template: EmailTemplate) {
    setSelectedId(template.id)
    setDraft({ ...template })
  }

  function saveDraft() {
    if (!activeTemplate || !templates.data) return
    saveTemplates.mutate(templates.data.map((template) => template.id === activeTemplate.id ? activeTemplate : template))
  }

  function resetDraft() {
    if (selectedTemplate) setDraft({ ...selectedTemplate })
  }

  if (templates.isPending) {
    return <div className="h-96 animate-pulse rounded-xl bg-white" role="status" aria-label="Loading email templates" />
  }

  if (templates.isError) {
    return <p className="rounded-xl bg-white p-6 text-sm text-[#9a4d4d]">{templates.error.message}</p>
  }

  return (
    <div className="mx-auto w-full max-w-[1600px]">
      <div className="grid overflow-hidden rounded-xl border border-[#e5eaf0] bg-white lg:grid-cols-[220px_minmax(0,1.25fr)_minmax(280px,.75fr)]">
        <aside className="border-b border-[#edf0f3] p-3 lg:border-b-0 lg:border-r">
          <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-[0.08em] text-[#91a0ae]">Templates</p>
          <nav className="grid grid-cols-2 gap-1 lg:block lg:space-y-1">
            {(templates.data ?? []).map((template) => (
              <button
                className={`w-full rounded-lg px-3 py-2.5 text-left text-xs font-medium ${(template.id === selectedId || (!selectedId && template.id === templates.data?.[0]?.id)) ? 'bg-[#edf3f7] text-[#193452]' : 'text-[#61758a] hover:bg-[#f6f8fa]'}`}
                key={template.id}
                onClick={() => selectTemplate(template)}
                type="button"
              >
                {template.name}
              </button>
            ))}
          </nav>
        </aside>

        {activeTemplate && (
          <>
            <section className="border-b border-[#edf0f3] p-5 lg:border-b-0 lg:border-r">
              <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#91a0ae]" htmlFor="template-subject">Subject</label>
              <input className="mt-2 h-10 w-full rounded-lg border border-[#dfe5ea] px-3 text-xs text-[#34495d] outline-none focus:border-[#65b883]" id="template-subject" onChange={(event) => setDraft({ ...activeTemplate, subject: event.target.value })} value={activeTemplate.subject} />
              <label className="mt-5 block text-[10px] font-bold uppercase tracking-[0.08em] text-[#91a0ae]" htmlFor="template-message">Message</label>
              <textarea className="mt-2 min-h-64 w-full resize-y rounded-lg border border-[#dfe5ea] p-3 text-xs leading-6 text-[#34495d] outline-none focus:border-[#65b883]" id="template-message" onChange={(event) => setDraft({ ...activeTemplate, message: event.target.value })} value={activeTemplate.message} />
              <div className="mt-4 flex gap-2">
                <button className="h-9 rounded-lg bg-[#193452] px-4 text-xs font-semibold text-white disabled:opacity-60" disabled={saveTemplates.isPending} onClick={saveDraft} type="button">{saveTemplates.isPending ? 'Saving…' : 'Save template'}</button>
                <button className="h-9 rounded-lg border border-[#dfe5ea] px-4 text-xs font-semibold text-[#52657a]" onClick={resetDraft} type="button">Reset default</button>
              </div>
              {saveTemplates.isSuccess && <p className="mt-3 text-[11px] text-[#367751]" role="status">Template saved in this browser session.</p>}
            </section>

            <aside className="p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#91a0ae]">Placeholders</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {['{{debtor_name}}', '{{business_name}}', '{{invoice_number}}', '{{transaction_amount}}', '{{amount_paid}}', '{{outstanding_balance}}', '{{due_date}}', '{{payment_link}}'].map((placeholder) => (
                  <span className="rounded-md bg-[#f1f4f7] px-2 py-1 text-[10px] text-[#52657a]" key={placeholder}>{placeholder}</span>
                ))}
              </div>
              <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#91a0ae]">Live preview</p>
              <div className="mt-2 overflow-hidden rounded-lg border border-[#e1e6eb]">
                <div className="border-b border-[#edf0f3] bg-[#f8fafb] px-3 py-2 text-[10px] text-[#718398]">Inbox • Credence reminder</div>
                <div className="p-3">
                  <p className="text-xs font-semibold leading-5 text-[#34495d]">{renderPreview(activeTemplate)}</p>
                  <p className="mt-3 whitespace-pre-wrap text-[11px] leading-5 text-[#718398]">{activeTemplate.message.slice(0, 180)}…</p>
                  <span className="mt-3 inline-flex h-8 items-center rounded-md bg-[#193452] px-3 text-[10px] font-semibold text-white">Pay Now</span>
                </div>
              </div>
            </aside>
          </>
        )}
      </div>
    </div>
  )
}
