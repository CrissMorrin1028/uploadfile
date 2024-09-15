'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText, Download } from "lucide-react"

// Simulated function to extract placeholders from a Word document
const extractPlaceholders = (file: File): Promise<string[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulated placeholders (in a real scenario, these would be extracted from the document)
      const placeholders = ['name', 'email', 'address', 'phone', 'company']
      resolve(placeholders)
    }, 1500) // Simulate processing delay
  })
}

// Simulated function to generate output document
const generateDocument = (data: Record<string, string>): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real scenario, this would use Docxtemplater to generate the document
      console.log('Generating document with data:', data)
      resolve('/path/to/generated/document.docx')
    }, 2000) // Simulate document generation delay
  })
}

export function DynamicWordDocumentGenerator() {
  const [file, setFile] = useState<File | null>(null)
  const [placeholders, setPlaceholders] = useState<string[]>([])
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [generatedDocumentUrl, setGeneratedDocumentUrl] = useState<string | null>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files[0]) {
      setIsLoading(true)
      setFile(files[0])
      const extractedPlaceholders = await extractPlaceholders(files[0])
      setPlaceholders(extractedPlaceholders)
      setFormData(Object.fromEntries(extractedPlaceholders.map(p => [p, ''])))
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    const documentUrl = await generateDocument(formData)
    setGeneratedDocumentUrl(documentUrl)
    setIsLoading(false)
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cargar Plantilla Word</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center w-full">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Haz clic para cargar</span> o arrastra y suelta</p>
                <p className="text-xs text-gray-500">WORD (DOC, DOCX)</p>
              </div>
              <input id="dropzone-file" type="file" className="hidden" onChange={handleFileUpload} accept=".doc,.docx" />
            </label>
          </div>
          {file && (
            <div className="mt-4 flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <span className="text-sm text-gray-500">{file.name}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </CardContent>
        </Card>
      )}

      {placeholders.length > 0 && !isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Formulario Dinámico</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {placeholders.map((placeholder) => (
                <div key={placeholder} className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor={placeholder}>{placeholder}</Label>
                  <Input
                    type="text"
                    id={placeholder}
                    value={formData[placeholder]}
                    onChange={(e) => handleInputChange(placeholder, e.target.value)}
                  />
                </div>
              ))}
              <Button type="submit" className="w-full">Generar Documento</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {generatedDocumentUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Documento Generado</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href={generatedDocumentUrl} download>
                <Download className="mr-2 h-4 w-4" /> Descargar Documento
              </a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}