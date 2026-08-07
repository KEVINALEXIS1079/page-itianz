"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { promises as fs } from "fs";
import path from "path";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

// Validación con Zod
const httpsUrl = z.string().url("Debe ser una URL válida").refine(val => val.startsWith("http://") || val.startsWith("https://"), {
  message: "Debe empezar con http:// o https://"
}).optional().or(z.literal(''));

const videoUrlSchema = httpsUrl.refine(val => {
  if (!val) return true;
  return val.includes("youtube.com") || val.includes("youtu.be") || val.includes("tiktok.com") || val.includes("instagram.com") || val.includes("artstation.com");
}, { message: "El enlace debe ser de YouTube, TikTok, Instagram o Artstation" });

// Función auxiliar de seguridad
const ADMIN_EMAILS = ["itianz.business@gmail.com", "bx57599@gmail.com"];
async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
    throw new Error("No autorizado");
  }
}

// Función auxiliar para subir archivos usando Vercel Blob
async function saveFile(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;
  
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  const filename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  
  // Sube el archivo a Vercel Blob
  const { put } = await import('@vercel/blob');
  const blob = await put(filename, file, { access: 'public' });
  
  return blob.url;
}

export async function createProject(formData: FormData) {
  await requireAdmin();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as string;
  
  let imageUrl = formData.get("imageUrl") as string | null;
  const imageFile = formData.get("imageFile") as File | null;
  if (imageFile && imageFile.size > 0) {
    imageUrl = await saveFile(imageFile);
  }

  const galleryFiles = formData.getAll("galleryFiles") as File[];
  const galleryUrls = [];
  for (const file of galleryFiles) {
    const u = await saveFile(file);
    if (u) galleryUrls.push(u);
  }
  const galleryStr = galleryUrls.length > 0 ? JSON.stringify(galleryUrls) : null;

  const videoUrlRaw = formData.get("videoUrl") as string | null;
  const videoUrl = videoUrlSchema.parse(videoUrlRaw || "");

  const featured = formData.get("featured") === "on";
  const isHidden = formData.get("isHidden") === "on";
  const orderIndex = parseInt(formData.get("orderIndex") as string || "0", 10);

  await prisma.project.create({
    data: { title, description, type, imageUrl: imageUrl || null, gallery: galleryStr, videoUrl: videoUrl || null, featured, orderIndex, isHidden },
  });

  revalidatePath("/");
  revalidatePath("/portal-secreto-itianz/proyectos");
}

export async function updateProject(id: string, formData: FormData) {
  await requireAdmin();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as string;
  
  let imageUrl = formData.get("imageUrl") as string | null;
  const imageFile = formData.get("imageFile") as File | null;
  if (imageFile && imageFile.size > 0) {
    imageUrl = await saveFile(imageFile);
  }

  const galleryFiles = formData.getAll("galleryFiles") as File[];
  const galleryUrls = [];
  for (const file of galleryFiles) {
    const u = await saveFile(file);
    if (u) galleryUrls.push(u);
  }

  const videoUrlRaw = formData.get("videoUrl") as string | null;
  const videoUrl = videoUrlSchema.parse(videoUrlRaw || "");

  const featured = formData.get("featured") === "on";
  const isHidden = formData.get("isHidden") === "on";
  const orderIndex = parseInt(formData.get("orderIndex") as string || "0", 10);

  const updateData: any = { title, description, type, videoUrl: videoUrl || null, featured, orderIndex, isHidden };
  if (imageUrl) updateData.imageUrl = imageUrl;
  if (galleryUrls.length > 0) updateData.gallery = JSON.stringify(galleryUrls);

  await prisma.project.update({
    where: { id },
    data: updateData,
  });

  revalidatePath("/");
  revalidatePath("/portal-secreto-itianz/proyectos");
}

export async function deleteProject(id: string) {
  await requireAdmin();
  await prisma.project.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/portal-secreto-itianz/proyectos");
}

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const name = formData.get("name") as string;
  if (!name) return;
  await prisma.category.create({ data: { name } });
  revalidatePath("/portal-secreto-itianz/productos");
  revalidatePath("/productos");
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  await prisma.category.delete({ where: { id } });
  revalidatePath("/portal-secreto-itianz/productos");
  revalidatePath("/productos");
}

export async function createProduct(formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const details = formData.get("details") as string;
  
  const urlRaw = formData.get("url") as string | null;
  const url = httpsUrl.parse(urlRaw || "");

  let imageUrl = formData.get("imageUrl") as string | null;
  const imageFile = formData.get("imageFile") as File | null;
  if (imageFile && imageFile.size > 0) {
    imageUrl = await saveFile(imageFile);
  }

  const galleryFiles = formData.getAll("galleryFiles") as File[];
  const galleryUrls = [];
  for (const file of galleryFiles) {
    const u = await saveFile(file);
    if (u) galleryUrls.push(u);
  }
  const galleryStr = galleryUrls.length > 0 ? JSON.stringify(galleryUrls) : null;

  const referralCode = formData.get("referralCode") as string | null;
  const categoryId = formData.get("categoryId") as string | null;
  const priceStr = formData.get("price") as string | null;
  const price = priceStr ? parseFloat(priceStr) : null;
  const isPeripheral = formData.get("isPeripheral") === "on";
  const featured = formData.get("featured") === "on";
  const isHidden = formData.get("isHidden") === "on";
  const orderIndex = parseInt(formData.get("orderIndex") as string || "0", 10);

  await prisma.product.create({
    data: {
      name, description, details, url: url || null, imageUrl: imageUrl || null, gallery: galleryStr,
      referralCode, price, isPeripheral, featured, orderIndex, isHidden,
      categoryId: categoryId || null,
    },
  });

  revalidatePath("/");
  revalidatePath("/productos");
  revalidatePath("/perifericos");
  revalidatePath("/portal-secreto-itianz/productos");
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const details = formData.get("details") as string;
  
  const urlRaw = formData.get("url") as string | null;
  const url = httpsUrl.parse(urlRaw || "");

  let imageUrl = formData.get("imageUrl") as string | null;
  const imageFile = formData.get("imageFile") as File | null;
  if (imageFile && imageFile.size > 0) {
    imageUrl = await saveFile(imageFile);
  }

  const galleryFiles = formData.getAll("galleryFiles") as File[];
  const galleryUrls = [];
  for (const file of galleryFiles) {
    const u = await saveFile(file);
    if (u) galleryUrls.push(u);
  }
  
  const referralCode = formData.get("referralCode") as string | null;
  const categoryId = formData.get("categoryId") as string | null;
  const priceStr = formData.get("price") as string | null;
  const price = priceStr ? parseFloat(priceStr) : null;
  const isPeripheral = formData.get("isPeripheral") === "on";
  const featured = formData.get("featured") === "on";
  const isHidden = formData.get("isHidden") === "on";
  const orderIndex = parseInt(formData.get("orderIndex") as string || "0", 10);

  const updateData: any = {
    name, description, details, url: url || null,
    referralCode, price, isPeripheral, featured, orderIndex, isHidden,
    categoryId: categoryId || null,
  };
  
  if (imageUrl) updateData.imageUrl = imageUrl;
  if (galleryUrls.length > 0) updateData.gallery = JSON.stringify(galleryUrls);

  await prisma.product.update({
    where: { id },
    data: updateData,
  });

  revalidatePath("/");
  revalidatePath("/productos");
  revalidatePath("/perifericos");
  revalidatePath("/portal-secreto-itianz/productos");
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/productos");
  revalidatePath("/perifericos");
  revalidatePath("/portal-secreto-itianz/productos");
}

export async function createClip(formData: FormData) {
  await requireAdmin();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const videoUrl = formData.get("videoUrl") as string;
  const isHidden = formData.get("isHidden") === "on";
  const orderIndex = parseInt(formData.get("orderIndex") as string || "0", 10);

  await prisma.clip.create({
    data: { title, description: description || null, videoUrl, isHidden, orderIndex }
  });
  revalidatePath("/");
  revalidatePath("/portal-secreto-itianz/clips");
}

export async function updateClip(id: string, formData: FormData) {
  await requireAdmin();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const videoUrl = formData.get("videoUrl") as string;
  const isHidden = formData.get("isHidden") === "on";
  const orderIndex = parseInt(formData.get("orderIndex") as string || "0", 10);

  await prisma.clip.update({
    where: { id },
    data: { title, description: description || null, videoUrl, isHidden, orderIndex }
  });
  revalidatePath("/");
  revalidatePath("/portal-secreto-itianz/clips");
}

export async function deleteClip(id: string) {
  await requireAdmin();
  await prisma.clip.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/portal-secreto-itianz/clips");
}
