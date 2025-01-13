"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}




type Etudiant = {
  id: number
  nom: string
  prenom: string
  email: string
  motdepasse: string
  telephone: string
  filiere: string
  annee_scolarite: string
  statut_etudiant: "Stage" | "Pas stage"
}

export const columns: ColumnDef<Etudiant>[] = [
  {
      accessorKey: "id",
      header: "ID",
  },
 {
  accessorKey: "nom",
  header: "Nom",
 },
  {
    accessorKey: "prenom",
    header: "Prenom",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "motdepasse",
    header: "Mot de passe",
  },
  {
    accessorKey: "telephone",
    header: "Telephone",
  },
  {
    accessorKey: "filiere",
    header: "Filiere",
  },
  {
    accessorKey: "annee_scolarite",
    header: "Annee Scolarite",
  },
  {
    accessorKey: "statut_etudiant",
    header: "Statut Etudiant",
  },
]
