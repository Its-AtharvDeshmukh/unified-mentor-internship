"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTouristPlace(formData: FormData) {
  const name = formData.get("name") as string;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const stateId = formData.get("stateId") as string;
  const categoryId = formData.get("categoryId") as string;
  const shortDescription = formData.get("shortDescription") as string;
  const description = formData.get("description") as string;
  const heroImage = formData.get("heroImage") as string;
  const bestTimeToVisit = formData.get("bestTimeToVisit") as string;
  const entryFee = formData.get("entryFee") as string;

  try {
    await prisma.touristPlace.create({
      data: {
        name,
        slug,
        stateId,
        categoryId,
        shortDescription,
        description,
        heroImage,
        bestTimeToVisit,
        entryFee,
        verified: true,
        featured: true,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to create tourist place:", error);
    return { success: false, error: "Database write failed." };
  }
}