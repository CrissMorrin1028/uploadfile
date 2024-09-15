// app/page.tsx
import { DynamicWordDocumentGenerator } from '@/components/dynamic-word-document-generator'

export default function Page() {
  return (
    <div>
      <h1 className="text-center text-2xl font-bold my-6">Generador de Documentos Word</h1>
      <DynamicWordDocumentGenerator />
    </div>
  );
}
