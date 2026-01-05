'use client'

import { fetchSERPGoogle } from '@/app/dashboard/analyse-serp/action'
import { SerpResults } from '@/app/dashboard/analyse-serp/serp-results'
import { Button } from '@/components/dashboard/button'
import {
  Combobox,
  ComboboxLabel,
  ComboboxOption,
} from '@/components/dashboard/combobox'
import { Field, Label } from '@/components/dashboard/fieldset'
import { Input } from '@/components/dashboard/input'
import { X } from 'lucide-react'
import { useActionState, useState } from 'react'

interface Location {
  code: number
  name: string
  parentCode: number | null
  countryCode: string
  type: 'Country' | 'Region' | 'Department' | 'City'
  displayName: string
}

const frenchLocations: Location[] = [
  // ========== PAYS ==========
  {
    code: 2250,
    name: 'France',
    parentCode: null,
    countryCode: 'FR',
    type: 'Country',
    displayName: 'France',
  },

  // ========== RÉGIONS (13) ==========
  {
    code: 20321,
    name: 'Île-de-France',
    parentCode: 2250,
    countryCode: 'FR',
    type: 'Region',
    displayName: 'Île-de-France',
  },
  {
    code: 20332,
    name: "Provence-Alpes-Côte d'Azur",
    parentCode: 2250,
    countryCode: 'FR',
    type: 'Region',
    displayName: "Provence-Alpes-Côte d'Azur",
  },
  {
    code: 9069525,
    name: 'Auvergne-Rhône-Alpes',
    parentCode: 2250,
    countryCode: 'FR',
    type: 'Region',
    displayName: 'Auvergne-Rhône-Alpes',
  },
  {
    code: 9068897,
    name: 'Occitanie',
    parentCode: 2250,
    countryCode: 'FR',
    type: 'Region',
    displayName: 'Occitanie',
  },
  {
    code: 9069522,
    name: 'Nouvelle-Aquitaine',
    parentCode: 2250,
    countryCode: 'FR',
    type: 'Region',
    displayName: 'Nouvelle-Aquitaine',
  },
  {
    code: 9068898,
    name: 'Hauts-de-France',
    parentCode: 2250,
    countryCode: 'FR',
    type: 'Region',
    displayName: 'Hauts-de-France',
  },
  {
    code: 20316,
    name: 'Bretagne',
    parentCode: 2250,
    countryCode: 'FR',
    type: 'Region',
    displayName: 'Bretagne',
  },
  {
    code: 20311,
    name: 'Grand Est',
    parentCode: 2250,
    countryCode: 'FR',
    type: 'Region',
    displayName: 'Grand Est',
  },
  {
    code: 20329,
    name: 'Pays de la Loire',
    parentCode: 2250,
    countryCode: 'FR',
    type: 'Region',
    displayName: 'Pays de la Loire',
  },
  {
    code: 9068565,
    name: 'Normandie',
    parentCode: 2250,
    countryCode: 'FR',
    type: 'Region',
    displayName: 'Normandie',
  },
  {
    code: 9068895,
    name: 'Bourgogne-Franche-Comté',
    parentCode: 2250,
    countryCode: 'FR',
    type: 'Region',
    displayName: 'Bourgogne-Franche-Comté',
  },
  {
    code: 20317,
    name: 'Centre-Val de Loire',
    parentCode: 2250,
    countryCode: 'FR',
    type: 'Region',
    displayName: 'Centre-Val de Loire',
  },
  {
    code: 20319,
    name: 'Corse',
    parentCode: 2250,
    countryCode: 'FR',
    type: 'Region',
    displayName: 'Corse',
  },

  // ========== DÉPARTEMENTS (96) ==========
  // Occitanie
  {
    code: 9040822,
    name: 'Hautes-Pyrénées',
    parentCode: 9068897,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Hautes-Pyrénées (65), Occitanie',
  },
  {
    code: 9040823,
    name: 'Gers',
    parentCode: 9068897,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Gers (32), Occitanie',
  },
  {
    code: 9040825,
    name: 'Tarn-et-Garonne',
    parentCode: 9068897,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Tarn-et-Garonne (82), Occitanie',
  },
  {
    code: 9040826,
    name: 'Lot',
    parentCode: 9068897,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Lot (46), Occitanie',
  },
  {
    code: 9040827,
    name: 'Tarn',
    parentCode: 9068897,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Tarn (81), Occitanie',
  },
  {
    code: 9040828,
    name: 'Haute-Garonne',
    parentCode: 9068897,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Haute-Garonne (31), Occitanie',
  },
  {
    code: 9040829,
    name: 'Ariège',
    parentCode: 9068897,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Ariège (09), Occitanie',
  },
  {
    code: 9040830,
    name: 'Pyrénées-Orientales',
    parentCode: 9068897,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Pyrénées-Orientales (66), Occitanie',
  },
  {
    code: 9040831,
    name: 'Aude',
    parentCode: 9068897,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Aude (11), Occitanie',
  },
  {
    code: 9040832,
    name: 'Hérault',
    parentCode: 9068897,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Hérault (34), Occitanie',
  },
  {
    code: 9040833,
    name: 'Aveyron',
    parentCode: 9068897,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Aveyron (12), Occitanie',
  },
  {
    code: 9040834,
    name: 'Lozère',
    parentCode: 9068897,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Lozère (48), Occitanie',
  },
  {
    code: 9040835,
    name: 'Gard',
    parentCode: 9068897,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Gard (30), Occitanie',
  },

  // Nouvelle-Aquitaine
  {
    code: 9040824,
    name: 'Lot-et-Garonne',
    parentCode: 9069522,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Lot-et-Garonne (47), Nouvelle-Aquitaine',
  },
  {
    code: 9040894,
    name: 'Corrèze',
    parentCode: 9069522,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Corrèze (19), Nouvelle-Aquitaine',
  },
  {
    code: 9040895,
    name: 'Haute-Vienne',
    parentCode: 9069522,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Haute-Vienne (87), Nouvelle-Aquitaine',
  },
  {
    code: 9040896,
    name: 'Creuse',
    parentCode: 9069522,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Creuse (23), Nouvelle-Aquitaine',
  },
  {
    code: 9040900,
    name: 'Vienne',
    parentCode: 9069522,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Vienne (86), Nouvelle-Aquitaine',
  },
  {
    code: 9040901,
    name: 'Charente',
    parentCode: 9069522,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Charente (16), Nouvelle-Aquitaine',
  },
  {
    code: 9040902,
    name: 'Dordogne',
    parentCode: 9069522,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Dordogne (24), Nouvelle-Aquitaine',
  },
  {
    code: 9040903,
    name: 'Charente-Maritime',
    parentCode: 9069522,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Charente-Maritime (17), Nouvelle-Aquitaine',
  },
  {
    code: 9040906,
    name: 'Deux-Sèvres',
    parentCode: 9069522,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Deux-Sèvres (79), Nouvelle-Aquitaine',
  },
  {
    code: 9040915,
    name: 'Landes',
    parentCode: 9069522,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Landes (40), Nouvelle-Aquitaine',
  },
  {
    code: 9040916,
    name: 'Gironde',
    parentCode: 9069522,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Gironde (33), Nouvelle-Aquitaine',
  },
  {
    code: 9040917,
    name: 'Pyrénées-Atlantiques',
    parentCode: 9069522,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Pyrénées-Atlantiques (64), Nouvelle-Aquitaine',
  },

  // Auvergne-Rhône-Alpes
  {
    code: 9040836,
    name: 'Ardèche',
    parentCode: 9069525,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Ardèche (07), Auvergne-Rhône-Alpes',
  },
  {
    code: 9040840,
    name: 'Drôme',
    parentCode: 9069525,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Drôme (26), Auvergne-Rhône-Alpes',
  },
  {
    code: 9040846,
    name: 'Isère',
    parentCode: 9069525,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Isère (38), Auvergne-Rhône-Alpes',
  },
  {
    code: 9040847,
    name: 'Ain',
    parentCode: 9069525,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Ain (01), Auvergne-Rhône-Alpes',
  },
  {
    code: 9040848,
    name: 'Savoie',
    parentCode: 9069525,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Savoie (73), Auvergne-Rhône-Alpes',
  },
  {
    code: 9040849,
    name: 'Haute-Savoie',
    parentCode: 9069525,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Haute-Savoie (74), Auvergne-Rhône-Alpes',
  },
  {
    code: 9040886,
    name: 'Allier',
    parentCode: 9069525,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Allier (03), Auvergne-Rhône-Alpes',
  },
  {
    code: 9040889,
    name: 'Loire',
    parentCode: 9069525,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Loire (42), Auvergne-Rhône-Alpes',
  },
  {
    code: 9040890,
    name: 'Rhône',
    parentCode: 9069525,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Rhône (69), Auvergne-Rhône-Alpes',
  },
  {
    code: 9040891,
    name: 'Haute-Loire',
    parentCode: 9069525,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Haute-Loire (43), Auvergne-Rhône-Alpes',
  },
  {
    code: 9040892,
    name: 'Puy-de-Dôme',
    parentCode: 9069525,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Puy-de-Dôme (63), Auvergne-Rhône-Alpes',
  },
  {
    code: 9040893,
    name: 'Cantal',
    parentCode: 9069525,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Cantal (15), Auvergne-Rhône-Alpes',
  },

  // Provence-Alpes-Côte d'Azur
  {
    code: 9040837,
    name: 'Bouches-du-Rhône',
    parentCode: 20332,
    countryCode: 'FR',
    type: 'Department',
    displayName: "Bouches-du-Rhône (13), Provence-Alpes-Côte d'Azur",
  },
  {
    code: 9040838,
    name: 'Var',
    parentCode: 20332,
    countryCode: 'FR',
    type: 'Department',
    displayName: "Var (83), Provence-Alpes-Côte d'Azur",
  },
  {
    code: 9040839,
    name: 'Vaucluse',
    parentCode: 20332,
    countryCode: 'FR',
    type: 'Department',
    displayName: "Vaucluse (84), Provence-Alpes-Côte d'Azur",
  },
  {
    code: 9040841,
    name: 'Hautes-Alpes',
    parentCode: 20332,
    countryCode: 'FR',
    type: 'Department',
    displayName: "Hautes-Alpes (05), Provence-Alpes-Côte d'Azur",
  },
  {
    code: 9040842,
    name: 'Alpes-de-Haute-Provence',
    parentCode: 20332,
    countryCode: 'FR',
    type: 'Department',
    displayName: "Alpes-de-Haute-Provence (04), Provence-Alpes-Côte d'Azur",
  },
  {
    code: 9040843,
    name: 'Alpes-Maritimes',
    parentCode: 20332,
    countryCode: 'FR',
    type: 'Department',
    displayName: "Alpes-Maritimes (06), Provence-Alpes-Côte d'Azur",
  },

  // Corse
  {
    code: 9040844,
    name: 'Haute-Corse',
    parentCode: 20319,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Haute-Corse (2B), Corse',
  },
  {
    code: 9040845,
    name: 'Corse-du-Sud',
    parentCode: 20319,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Corse-du-Sud (2A), Corse',
  },

  // Bourgogne-Franche-Comté
  {
    code: 9040850,
    name: 'Jura',
    parentCode: 9068895,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Jura (39), Bourgogne-Franche-Comté',
  },
  {
    code: 9040851,
    name: 'Doubs',
    parentCode: 9068895,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Doubs (25), Bourgogne-Franche-Comté',
  },
  {
    code: 9040853,
    name: 'Territoire de Belfort',
    parentCode: 9068895,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Territoire de Belfort (90), Bourgogne-Franche-Comté',
  },
  {
    code: 9040854,
    name: 'Haute-Saône',
    parentCode: 9068895,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Haute-Saône (70), Bourgogne-Franche-Comté',
  },
  {
    code: 9040882,
    name: "Côte-d'Or",
    parentCode: 9068895,
    countryCode: 'FR',
    type: 'Department',
    displayName: "Côte-d'Or (21), Bourgogne-Franche-Comté",
  },
  {
    code: 9040883,
    name: 'Yonne',
    parentCode: 9068895,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Yonne (89), Bourgogne-Franche-Comté',
  },
  {
    code: 9040887,
    name: 'Nièvre',
    parentCode: 9068895,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Nièvre (58), Bourgogne-Franche-Comté',
  },
  {
    code: 9040888,
    name: 'Saône-et-Loire',
    parentCode: 9068895,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Saône-et-Loire (71), Bourgogne-Franche-Comté',
  },

  // Grand Est
  {
    code: 9040852,
    name: 'Haut-Rhin',
    parentCode: 20311,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Haut-Rhin (68), Grand Est',
  },
  {
    code: 9040855,
    name: 'Vosges',
    parentCode: 20311,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Vosges (88), Grand Est',
  },
  {
    code: 9040856,
    name: 'Moselle',
    parentCode: 20311,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Moselle (57), Grand Est',
  },
  {
    code: 9040857,
    name: 'Meurthe-et-Moselle',
    parentCode: 20311,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Meurthe-et-Moselle (54), Grand Est',
  },
  {
    code: 9040858,
    name: 'Bas-Rhin',
    parentCode: 20311,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Bas-Rhin (67), Grand Est',
  },
  {
    code: 9040878,
    name: 'Marne',
    parentCode: 20311,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Marne (51), Grand Est',
  },
  {
    code: 9040879,
    name: 'Ardennes',
    parentCode: 20311,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Ardennes (08), Grand Est',
  },
  {
    code: 9040880,
    name: 'Meuse',
    parentCode: 20311,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Meuse (55), Grand Est',
  },
  {
    code: 9040881,
    name: 'Haute-Marne',
    parentCode: 20311,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Haute-Marne (52), Grand Est',
  },
  {
    code: 9040884,
    name: 'Aube',
    parentCode: 20311,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Aube (10), Grand Est',
  },

  // Hauts-de-France
  {
    code: 9040859,
    name: 'Nord',
    parentCode: 9068898,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Nord (59), Hauts-de-France',
  },
  {
    code: 9040860,
    name: 'Pas-de-Calais',
    parentCode: 9068898,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Pas-de-Calais (62), Hauts-de-France',
  },
  {
    code: 9040875,
    name: 'Somme',
    parentCode: 9068898,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Somme (80), Hauts-de-France',
  },
  {
    code: 9040876,
    name: 'Oise',
    parentCode: 9068898,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Oise (60), Hauts-de-France',
  },
  {
    code: 9040877,
    name: 'Aisne',
    parentCode: 9068898,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Aisne (02), Hauts-de-France',
  },

  // Normandie
  {
    code: 9040861,
    name: 'Seine-Maritime',
    parentCode: 9068565,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Seine-Maritime (76), Normandie',
  },
  {
    code: 9040862,
    name: 'Eure',
    parentCode: 9068565,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Eure (27), Normandie',
  },
  {
    code: 9040863,
    name: 'Orne',
    parentCode: 9068565,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Orne (61), Normandie',
  },
  {
    code: 9040909,
    name: 'Calvados',
    parentCode: 9068565,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Calvados (14), Normandie',
  },
  {
    code: 9040910,
    name: 'Manche',
    parentCode: 9068565,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Manche (50), Normandie',
  },

  // Pays de la Loire
  {
    code: 9040864,
    name: 'Sarthe',
    parentCode: 20329,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Sarthe (72), Pays de la Loire',
  },
  {
    code: 9040904,
    name: 'Vendée',
    parentCode: 20329,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Vendée (85), Pays de la Loire',
  },
  {
    code: 9040905,
    name: 'Loire-Atlantique',
    parentCode: 20329,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Loire-Atlantique (44), Pays de la Loire',
  },
  {
    code: 9040907,
    name: 'Maine-et-Loire',
    parentCode: 20329,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Maine-et-Loire (49), Pays de la Loire',
  },
  {
    code: 9040908,
    name: 'Mayenne',
    parentCode: 20329,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Mayenne (53), Pays de la Loire',
  },

  // Centre-Val de Loire
  {
    code: 9040865,
    name: 'Eure-et-Loir',
    parentCode: 20317,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Eure-et-Loir (28), Centre-Val de Loire',
  },
  {
    code: 9040866,
    name: 'Loir-et-Cher',
    parentCode: 20317,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Loir-et-Cher (41), Centre-Val de Loire',
  },
  {
    code: 9040867,
    name: 'Loiret',
    parentCode: 20317,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Loiret (45), Centre-Val de Loire',
  },
  {
    code: 9040897,
    name: 'Cher',
    parentCode: 20317,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Cher (18), Centre-Val de Loire',
  },
  {
    code: 9040898,
    name: 'Indre',
    parentCode: 20317,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Indre (36), Centre-Val de Loire',
  },
  {
    code: 9040899,
    name: 'Indre-et-Loire',
    parentCode: 20317,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Indre-et-Loire (37), Centre-Val de Loire',
  },

  // Île-de-France
  {
    code: 9040868,
    name: 'Essonne',
    parentCode: 20321,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Essonne (91), Île-de-France',
  },
  {
    code: 9040869,
    name: 'Val-de-Marne',
    parentCode: 20321,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Val-de-Marne (94), Île-de-France',
  },
  {
    code: 9040870,
    name: 'Seine-Saint-Denis',
    parentCode: 20321,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Seine-Saint-Denis (93), Île-de-France',
  },
  {
    code: 9040871,
    name: 'Paris',
    parentCode: 20321,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Paris (75), Île-de-France',
  },
  {
    code: 9040872,
    name: 'Hauts-de-Seine',
    parentCode: 20321,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Hauts-de-Seine (92), Île-de-France',
  },
  {
    code: 9040873,
    name: 'Yvelines',
    parentCode: 20321,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Yvelines (78), Île-de-France',
  },
  {
    code: 9040874,
    name: "Val-d'Oise",
    parentCode: 20321,
    countryCode: 'FR',
    type: 'Department',
    displayName: "Val-d'Oise (95), Île-de-France",
  },
  {
    code: 9040885,
    name: 'Seine-et-Marne',
    parentCode: 20321,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Seine-et-Marne (77), Île-de-France',
  },

  // Bretagne
  {
    code: 9040911,
    name: 'Ille-et-Vilaine',
    parentCode: 20316,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Ille-et-Vilaine (35), Bretagne',
  },
  {
    code: 9040912,
    name: 'Morbihan',
    parentCode: 20316,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Morbihan (56), Bretagne',
  },
  {
    code: 9040913,
    name: "Côtes-d'Armor",
    parentCode: 20316,
    countryCode: 'FR',
    type: 'Department',
    displayName: "Côtes-d'Armor (22), Bretagne",
  },
  {
    code: 9040914,
    name: 'Finistère',
    parentCode: 20316,
    countryCode: 'FR',
    type: 'Department',
    displayName: 'Finistère (29), Bretagne',
  },

  // ========== VILLES (Top 30) ==========
  {
    code: 1006094,
    name: 'Paris',
    parentCode: 20321,
    countryCode: 'FR',
    type: 'City',
    displayName: 'Paris, Île-de-France',
  },
  {
    code: 1006356,
    name: 'Marseille',
    parentCode: 20332,
    countryCode: 'FR',
    type: 'City',
    displayName: "Marseille, Provence-Alpes-Côte d'Azur",
  },
  {
    code: 1006410,
    name: 'Lyon',
    parentCode: 9069525,
    countryCode: 'FR',
    type: 'City',
    displayName: 'Lyon, Auvergne-Rhône-Alpes',
  },
  {
    code: 1006219,
    name: 'Toulouse',
    parentCode: 9068897,
    countryCode: 'FR',
    type: 'City',
    displayName: 'Toulouse, Occitanie',
  },
  {
    code: 1006359,
    name: 'Nice',
    parentCode: 20332,
    countryCode: 'FR',
    type: 'City',
    displayName: "Nice, Provence-Alpes-Côte d'Azur",
  },
  {
    code: 1006285,
    name: 'Nantes',
    parentCode: 20329,
    countryCode: 'FR',
    type: 'City',
    displayName: 'Nantes, Pays de la Loire',
  },
  {
    code: 1005801,
    name: 'Strasbourg',
    parentCode: 20311,
    countryCode: 'FR',
    type: 'City',
    displayName: 'Strasbourg, Grand Est',
  },
  {
    code: 1006161,
    name: 'Montpellier',
    parentCode: 9068897,
    countryCode: 'FR',
    type: 'City',
    displayName: 'Montpellier, Occitanie',
  },
  {
    code: 1005811,
    name: 'Bordeaux',
    parentCode: 9069522,
    countryCode: 'FR',
    type: 'City',
    displayName: 'Bordeaux, Nouvelle-Aquitaine',
  },
  {
    code: 1006235,
    name: 'Lille',
    parentCode: 9068898,
    countryCode: 'FR',
    type: 'City',
    displayName: 'Lille, Hauts-de-France',
  },
  {
    code: 1005876,
    name: 'Rennes',
    parentCode: 20316,
    countryCode: 'FR',
    type: 'City',
    displayName: 'Rennes, Bretagne',
  },
  {
    code: 1005925,
    name: 'Reims',
    parentCode: 20311,
    countryCode: 'FR',
    type: 'City',
    displayName: 'Reims, Grand Est',
  },
  {
    code: 1006262,
    name: 'Le Havre',
    parentCode: 9068565,
    countryCode: 'FR',
    type: 'City',
    displayName: 'Le Havre, Normandie',
  },
  {
    code: 1006427,
    name: 'Saint-Étienne',
    parentCode: 9069525,
    countryCode: 'FR',
    type: 'City',
    displayName: 'Saint-Étienne, Auvergne-Rhône-Alpes',
  },
  {
    code: 1006367,
    name: 'Toulon',
    parentCode: 20332,
    countryCode: 'FR',
    type: 'City',
    displayName: "Toulon, Provence-Alpes-Côte d'Azur",
  },
  {
    code: 1006400,
    name: 'Grenoble',
    parentCode: 9069525,
    countryCode: 'FR',
    type: 'City',
    displayName: 'Grenoble, Auvergne-Rhône-Alpes',
  },
  {
    code: 1005850,
    name: 'Dijon',
    parentCode: 9068895,
    countryCode: 'FR',
    type: 'City',
    displayName: 'Dijon, Bourgogne-Franche-Comté',
  },
  {
    code: 1006271,
    name: 'Angers',
    parentCode: 20329,
    countryCode: 'FR',
    type: 'City',
    displayName: 'Angers, Pays de la Loire',
  },
  {
    code: 1006164,
    name: 'Nîmes',
    parentCode: 9068897,
    countryCode: 'FR',
    type: 'City',
    displayName: 'Nîmes, Occitanie',
  },
  {
    code: 1006443,
    name: 'Villeurbanne',
    parentCode: 9069525,
    countryCode: 'FR',
    type: 'City',
    displayName: 'Villeurbanne, Auvergne-Rhône-Alpes',
  },
  {
    code: 1005835,
    name: 'Clermont-Ferrand',
    parentCode: 9069525,
    countryCode: 'FR',
    type: 'City',
    displayName: 'Clermont-Ferrand, Auvergne-Rhône-Alpes',
  },
  {
    code: 1006280,
    name: 'Le Mans',
    parentCode: 20329,
    countryCode: 'FR',
    type: 'City',
    displayName: 'Le Mans, Pays de la Loire',
  },
  {
    code: 1006327,
    name: 'Aix-en-Provence',
    parentCode: 20332,
    countryCode: 'FR',
    type: 'City',
    displayName: "Aix-en-Provence, Provence-Alpes-Côte d'Azur",
  },
  {
    code: 1005859,
    name: 'Brest',
    parentCode: 20316,
    countryCode: 'FR',
    type: 'City',
    displayName: 'Brest, Bretagne',
  },
  {
    code: 1005910,
    name: 'Tours',
    parentCode: 20317,
    countryCode: 'FR',
    type: 'City',
    displayName: 'Tours, Centre-Val de Loire',
  },
  {
    code: 1006296,
    name: 'Amiens',
    parentCode: 9068898,
    countryCode: 'FR',
    type: 'City',
    displayName: 'Amiens, Hauts-de-France',
  },
  {
    code: 1006171,
    name: 'Limoges',
    parentCode: 9069522,
    countryCode: 'FR',
    type: 'City',
    displayName: 'Limoges, Nouvelle-Aquitaine',
  },
  {
    code: 1006374,
    name: 'Annecy',
    parentCode: 9069525,
    countryCode: 'FR',
    type: 'City',
    displayName: 'Annecy, Auvergne-Rhône-Alpes',
  },
  {
    code: 1006165,
    name: 'Perpignan',
    parentCode: 9068897,
    countryCode: 'FR',
    type: 'City',
    displayName: 'Perpignan, Occitanie',
  },
  {
    code: 1006268,
    name: 'Rouen',
    parentCode: 9068565,
    countryCode: 'FR',
    type: 'City',
    displayName: 'Rouen, Normandie',
  },
]

const getLocationsByType = (type: Location['type']) => {
  return frenchLocations.filter((loc) => loc.type === type)
}

const getRegions = () => getLocationsByType('Region')
const getDepartments = () => getLocationsByType('Department')
const getCities = () => getLocationsByType('City')

export function FormSerpGoogle() {
  const [state, formAction, isPending] = useActionState(
    fetchSERPGoogle,
    undefined,
  )

  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  )

  const regions = getRegions()
  const departments = getDepartments()
  const cities = getCities()

  // ✅ CORRECTION : Accepter Location | null
  const handleLocationSelect = (location: Location | null) => {
    setSelectedLocation(location)
  }

  const handleReset = () => {
    setSelectedLocation(null)
    const form = document.forms[0]
    form.reset()
  }

  const isRegionDisabled =
    selectedLocation && selectedLocation.type !== 'Region'
  const isDepartmentDisabled =
    selectedLocation && selectedLocation.type !== 'Department'
  const isCityDisabled = selectedLocation && selectedLocation.type !== 'City'

  console.log(state)

  return (
    <form action={formAction}>
      <div className="w-full max-w-2xl space-y-4 lg:max-w-3xl">
        {/* Mot-clé */}
        <Field>
          <Label>Mot-clé de recherche</Label>
          <Input placeholder="Saisissez un mot clé" name="keyword" required />
        </Field>

        {/* Hidden input pour le location_code */}
        <input
          type="hidden"
          name="location_code"
          value={selectedLocation?.code || 2250}
        />

        {/* Affichage de la localisation sélectionnée */}
        {selectedLocation && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900">
                  Localisation sélectionnée
                </p>
                <p className="text-sm text-blue-700">
                  {selectedLocation.displayName}
                </p>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="rounded-full p-1 text-blue-600 transition-transform hover:scale-110 hover:cursor-pointer hover:bg-blue-100"
                title="Changer de localisation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {/* Région */}
          <Field>
            <Label>
              Région{' '}
              {isRegionDisabled && (
                <span className="text-xs text-gray-500">(désactivé)</span>
              )}
            </Label>
            <Combobox
              name="region_display"
              options={regions}
              displayValue={(location) =>
                location?.displayName || 'Sélectionner une région'
              }
              value={
                selectedLocation?.type === 'Region'
                  ? selectedLocation
                  : undefined
              }
              onChange={handleLocationSelect}
              disabled={!!isRegionDisabled}
            >
              {(location) => (
                <ComboboxOption value={location}>
                  <ComboboxLabel>{location.displayName}</ComboboxLabel>
                </ComboboxOption>
              )}
            </Combobox>
          </Field>

          {/* Département */}
          <Field>
            <Label>
              Département{' '}
              {isDepartmentDisabled && (
                <span className="text-xs text-gray-500">(désactivé)</span>
              )}
            </Label>
            <Combobox
              name="department_display"
              options={departments}
              displayValue={(location) =>
                location?.displayName || 'Sélectionner un département'
              }
              value={
                selectedLocation?.type === 'Department'
                  ? selectedLocation
                  : undefined
              }
              onChange={handleLocationSelect}
              disabled={!!isDepartmentDisabled}
            >
              {(location) => (
                <ComboboxOption value={location}>
                  <ComboboxLabel>{location.displayName}</ComboboxLabel>
                </ComboboxOption>
              )}
            </Combobox>
          </Field>

          {/* Ville */}
          <Field>
            <Label>
              Ville{' '}
              {isCityDisabled && (
                <span className="text-xs text-gray-500">(désactivé)</span>
              )}
            </Label>
            <Combobox
              name="city_display"
              options={cities}
              displayValue={(location) =>
                location?.displayName || 'Sélectionner une ville'
              }
              value={
                selectedLocation?.type === 'City' ? selectedLocation : undefined
              }
              onChange={handleLocationSelect}
              disabled={!!isCityDisabled}
            >
              {(location) => (
                <ComboboxOption value={location}>
                  <ComboboxLabel>{location.displayName}</ComboboxLabel>
                </ComboboxOption>
              )}
            </Combobox>
          </Field>

          <Button color="indigo" type="submit" disabled={isPending}>
            {isPending ? 'Analyse en cours...' : 'Analyser'}
          </Button>

          <p className="text-sm text-gray-500">
            Vous ne pouvez sélectionner qu&apos;une seule localisation : région{' '}
            <strong>OU</strong> département <strong>OU</strong> ville. Par
            défaut, la recherche est effectuée pour toute la France.
          </p>
        </div>

      </div>

      {/* Affichage des résultats - EN DEHORS du conteneur du formulaire */}
      {state?.success === true && state?.result && (
        <div className="w-full">
          {console.log('📊 State dans le formulaire (succès):', state)}
          <SerpResults
            success={state.success}
            result={state.result}
            keyword={state.keyword}
            location_code={state.location_code}
            message={state.message}
          />
        </div>
      )}

      <div className="hidden">
        {/* Debug et erreurs */}

        {/* Debug: Afficher le state en développement */}
        {process.env.NODE_ENV === 'development' && state && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="mb-2 text-xs font-semibold text-amber-900">
              Debug State:
            </p>
            <pre className="max-h-40 overflow-auto text-xs font-mono text-amber-900">
              {JSON.stringify(state, null, 2)}
            </pre>
          </div>
        )}

        {/* Affichage des erreurs */}
        {state?.error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-900">❌ Erreur</p>
          {typeof state.error === 'string' ? (
            <p className="mt-1 text-sm text-red-700">{state.error}</p>
          ) : (
            <div className="mt-2 space-y-1">
              {Object.entries(state.error).map(([field, errors]) => (
                <div key={field}>
                  <p className="text-xs font-medium text-red-800">{field}:</p>
                  {Array.isArray(errors) &&
                    errors.map((error: string, index: number) => (
                      <p key={index} className="text-xs text-red-700">
                        • {error}
                      </p>
                    ))}
                </div>
              ))}
            </div>
          )}
        </div>
        )}
      </div>
    </form>
  )
}
