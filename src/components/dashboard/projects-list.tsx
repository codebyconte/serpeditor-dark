'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { headers } from 'next/headers'

export async function ProjectsList() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const projects = await prisma.project.findMany({
    where: {
      userId: session?.user?.id,
    },
  })

  return (
    <div>
      {projects.map((project) => (
        <div key={project.id}>{project.url}</div>
      ))}
    </div>
  )
}
