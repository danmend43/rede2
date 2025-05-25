import { Grid3X3 } from "lucide-react"

export function CollectionsTab() {
  return (
    <div className="flex flex-col items-center justify-center h-96 text-gray-500">
      <Grid3X3 className="w-16 h-16 mb-4 text-gray-300" />
      <h3 className="text-lg font-medium mb-2">Nenhuma coleção ainda</h3>
      <p className="text-sm text-center">Organize seus vídeos em coleções para facilitar a navegação.</p>
    </div>
  )
}
