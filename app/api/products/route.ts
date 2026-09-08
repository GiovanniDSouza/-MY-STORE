import { NextResponse } from "next/server";
import { getCatalogProducts } from "../../../src/data/products";

export async function GET() {
  try {
    const products = await getCatalogProducts();

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("Erro ao listar produtos:", error);
    return NextResponse.json({ error: "Erro ao listar produtos." }, { status: 500 });
  }
}
