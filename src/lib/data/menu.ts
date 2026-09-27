import type { Category, Product } from "@/types";
 
// Datos de respaldo mientras no haya credenciales reales de Supabase
// (ver src/lib/supabase/client.ts). En cuanto NEXT_PUBLIC_SUPABASE_URL
// apunte a un proyecto real con las tablas del esquema SQL, la sección
// de Carta (src/components/sections/Menu.jsx) usará esos datos en su lugar.
 
export const CATEGORIES: Category[] = [
  { id: "burgers", name: "Smashburgers", slug: "burgers", sort_order: 0 },
  { id: "entrantes", name: "Entrantes", slug: "entrantes", sort_order: 1 },
  { id: "combos", name: "Combos", slug: "combos", sort_order: 2 },
  { id: "bebidas", name: "Bebidas", slug: "bebidas", sort_order: 3 },
  { id: "postres", name: "Postres", slug: "postres", sort_order: 4 },
];
 
export const PRODUCTS: Product[] = [
  {
    id: "burger-original",
    category_id: "burgers",
    name: "La Original",
    description:
      "Doble smash de vacuno, queso cheddar fundido, cebolla caramelizada, pepinillos y salsa de la casa en pan brioche.",
    price: 9.9,
    image_url:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80&auto=format&fit=crop",
    allergens: ["gluten", "lacteos", "huevo", "mostaza"],
    is_combo_eligible: true,
    is_available: true,
  },
  {
    id: "burger-cabrona",
    category_id: "burgers",
    name: "La Cabrona",
    description:
      "Doble smash, bacon crujiente, queso azul, rúcula y mermelada de cebolla picante.",
    price: 11.5,
    image_url:
      "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800&q=80&auto=format&fit=crop",
    allergens: ["gluten", "lacteos", "huevo", "sulfitos"],
    is_combo_eligible: true,
    is_available: true,
  },
  {
    id: "burger-trufada",
    category_id: "burgers",
    name: "La Trufada",
    description:
      "Smash simple, queso emmental, mayonesa de trufa negra, champiñones salteados y cebolla frita.",
    price: 11.9,
    image_url:
      "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80&auto=format&fit=crop",
    allergens: ["gluten", "lacteos", "huevo"],
    is_combo_eligible: true,
    is_available: true,
  },
  {
    id: "burger-diabla",
    category_id: "burgers",
    name: "La Picante Diabla",
    description:
      "Doble smash, jalapeños, queso pepper jack, salsa buffalo y aros de cebolla crujientes.",
    price: 11.5,
    image_url:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80&auto=format&fit=crop",
    allergens: ["gluten", "lacteos", "huevo"],
    is_combo_eligible: true,
    is_available: true,
  },
  {
    id: "burger-vegana",
    category_id: "burgers",
    name: "La Vegana del Barrio",
    description:
      "Smash de garbanzos y remolacha, queso vegano ahumado, alioli vegano y tomate confitado.",
    price: 10.9,
    image_url:
      "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=800&q=80&auto=format&fit=crop",
    allergens: ["gluten", "soja"],
    is_combo_eligible: true,
    is_available: true,
  },
 
  {
    id: "entrante-patatas-clasicas",
    category_id: "entrantes",
    name: "Patatas fritas clásicas",
    description: "Corte grueso, doble fritura, sal en escamas.",
    price: 3.5,
    image_url:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80&auto=format&fit=crop",
    allergens: [],
    is_combo_eligible: false,
    is_available: true,
  },
  {
    id: "entrante-patatas-trufadas",
    category_id: "entrantes",
    name: "Patatas trufadas con parmesano",
    description: "Aceite de trufa negra y parmesano recién rallado.",
    price: 5.5,
    image_url:
      "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=800&q=80&auto=format&fit=crop",
    allergens: ["lacteos"],
    is_combo_eligible: false,
    is_available: true,
  },
  {
    id: "entrante-patatas-bacon",
    category_id: "entrantes",
    name: "Patatas con bacon y queso cheddar",
    description: "Bacon crujiente, cheddar fundido y toque de cebollino.",
    price: 6.5,
    image_url:
      "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=800&q=80&auto=format&fit=crop",
    allergens: ["lacteos"],
    is_combo_eligible: false,
    is_available: true,
  },
  {
    id: "entrante-tequenos",
    category_id: "entrantes",
    name: "Tequeños de queso (6 uds)",
    description: "Crujientes por fuera, queso fundido por dentro.",
    price: 6.9,
    image_url:
      "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=800&q=80&auto=format&fit=crop",
    allergens: ["gluten", "lacteos"],
    is_combo_eligible: false,
    is_available: true,
  },
 
  {
    id: "combo-original",
    category_id: "combos",
    name: "Combo La Original",
    description: "La Original + patatas clásicas + refresco o agua.",
    price: 13.4,
    image_url:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80&auto=format&fit=crop",
    allergens: ["gluten", "lacteos", "huevo", "mostaza"],
    is_combo_eligible: false,
    is_available: true,
  },
  {
    id: "combo-cabrona",
    category_id: "combos",
    name: "Combo La Cabrona",
    description: "La Cabrona + patatas clásicas + refresco o agua.",
    price: 15.0,
    image_url:
      "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800&q=80&auto=format&fit=crop",
    allergens: ["gluten", "lacteos", "huevo", "sulfitos"],
    is_combo_eligible: false,
    is_available: true,
  },
  {
    id: "combo-diabla",
    category_id: "combos",
    name: "Combo La Picante Diabla",
    description: "La Picante Diabla + patatas clásicas + refresco o agua.",
    price: 15.0,
    image_url:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&q=80&auto=format&fit=crop",
    allergens: ["gluten", "lacteos", "huevo"],
    is_combo_eligible: false,
    is_available: true,
  },
 
  {
    id: "bebida-refresco",
    category_id: "bebidas",
    name: "Refresco (Coca-Cola, Fanta, Sprite)",
    description: "33cl, bien frío.",
    price: 2.5,
    image_url:
      "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&q=80&auto=format&fit=crop",
    allergens: [],
    is_combo_eligible: false,
    is_available: true,
  },
  {
    id: "bebida-agua",
    category_id: "bebidas",
    name: "Agua",
    description: "50cl.",
    price: 1.8,
    image_url:
      "https://images.unsplash.com/photo-1560023907-5f339617ea30?w=800&q=80&auto=format&fit=crop",
    allergens: [],
    is_combo_eligible: false,
    is_available: true,
  },
  {
    id: "bebida-cerveza",
    category_id: "bebidas",
    name: "Cerveza artesana Calle Fuego",
    description: "Elaboración propia, 33cl.",
    price: 3.5,
    image_url:
      "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=800&q=80&auto=format&fit=crop",
    allergens: ["gluten"],
    is_combo_eligible: false,
    is_available: true,
  },
  {
    id: "bebida-batido",
    category_id: "bebidas",
    name: "Batido (vainilla, chocolate o fresa)",
    description: "Cremoso y bien cargado.",
    price: 4.5,
    image_url:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80&auto=format&fit=crop",
    allergens: ["lacteos"],
    is_combo_eligible: false,
    is_available: true,
  },
 
  {
    id: "postre-brownie",
    category_id: "postres",
    name: "Brownie con helado de vainilla",
    description: "Brownie templado, helado artesano y salsa de chocolate.",
    price: 4.9,
    image_url:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80&auto=format&fit=crop",
    allergens: ["gluten", "lacteos", "huevo", "frutos_cascara"],
    is_combo_eligible: false,
    is_available: true,
  },
  {
    id: "postre-cookie",
    category_id: "postres",
    name: "Cookie dough con Nutella",
    description: "Masa de cookie horneada al momento con Nutella fundida.",
    price: 4.5,
    image_url:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&q=80&auto=format&fit=crop",
    allergens: ["gluten", "lacteos", "huevo", "frutos_cascara"],
    is_combo_eligible: false,
    is_available: true,
  },
];
 