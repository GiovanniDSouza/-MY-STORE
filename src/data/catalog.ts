export type Product = {
  id: number;
  slug: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  features: string[];
};

export const fallbackProducts: Product[] = [
  {
    id: 1,
    slug: "notebook-essential",
    name: "Notebook Essential",
    category: "Tecnologia",
    price: 2499,
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
    description:
      "Notebook leve, rápido e com excelente autonomia para trabalho, estudo e produtividade no dia a dia.",
    features: [
      '15,6" Full HD',
      "16GB RAM",
      "SSD 512GB",
      "Autonomia de até 10h",
    ],
  },
  {
    id: 2,
    slug: "camera-lite-pro",
    name: "Câmera Lite Pro",
    category: "Acessórios",
    price: 1899,
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80",
    description:
      "Captura imagens com qualidade profissional, ideal para gravações, vídeos e registros do cotidiano.",
    features: ["4K", "Sensor de 24MP", "Estabilização", "Gravação Full HD"],
  },
  {
    id: 3,
    slug: "mesa-de-escritorio",
    name: "Mesa de Escritório",
    category: "Casa",
    price: 799,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    description:
      "Estrutura moderna e funcional para organizar seu espaço de trabalho com conforto e estilo.",
    features: [
      "Madeira natural",
      "Design minimalista",
      "Espaço para monitor",
      "Fácil montagem",
    ],
  },
  {
    id: 4,
    slug: "fone-bluetooth-x",
    name: "Fone Bluetooth X",
    category: "Eletrônicos",
    price: 349,
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80",
    description:
      "Som envolvente com conforto para longas horas de uso e conexão rápida com qualquer dispositivo.",
    features: [
      "Bluetooth 5.3",
      "Até 30h de bateria",
      "Cancelamento de ruído",
      "Microfone embutido",
    ],
  },
];

export const products: Product[] = fallbackProducts;

export function formatPrice(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
