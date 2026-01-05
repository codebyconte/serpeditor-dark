'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Globe } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

interface Project {
  id: string
  url: string
}

interface ProjectSelectorProps {
  projects: Project[]
  currentProjectId?: string | null
}

export function ProjectSelector({
  projects,
  currentProjectId,
}: ProjectSelectorProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleProjectChange = (projectId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('project', projectId)
    router.push(`?${params.toString()}`)
  }

  if (projects.length <= 1) {
    return null
  }

  const selectedProject =
    projects.find((p) => p.id === currentProjectId) || projects[0]

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select
        value={currentProjectId || projects[0]?.id || ''}
        onValueChange={handleProjectChange}
      >
        <SelectTrigger className="w-[250px]">
          <SelectValue>
            {selectedProject
              ? selectedProject.url.replace(/^https?:\/\//, '')
              : 'Sélectionner un projet'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {projects.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              {project.url.replace(/^https?:\/\//, '')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
