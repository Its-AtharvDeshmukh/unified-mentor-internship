"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createDestination(formData: FormData) {
  const name = formData.get("name") as string;
  const slug = (formData.get("slug") as string).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
  const shortDescription = formData.get("shortDescription") as string;
  const description = formData.get("description") as string;
  const heroImage = formData.get("heroImage") as string;
  const stateName = (formData.get("stateName") as string).trim();
  const categoryName = (formData.get("categoryName") as string).trim();
  const bestTimeToVisit = (formData.get("bestTimeToVisit") as string) || "Oct – Mar";
  const entryFee = (formData.get("entryFee") as string) || "Standard Public Tariff";
  const openingTime = (formData.get("openingTime") as string) || "06:00 AM";
  const closingTime = (formData.get("closingTime") as string) || "06:00 PM";
  const address = (formData.get("address") as string) || stateName;

  const stateSlug = stateName.toLowerCase().replace(/\s+/g, "-");
  const state = await prisma.state.upsert({
    where: { slug: stateSlug },
    update: {},
    create: {
      name: stateName,
      slug: stateSlug,
      capital: "Administrative Hub",
      region: "Central India",
      shortDescription: `Historical and cultural heritage of ${stateName}.`,
      description: `Comprehensive archive covering monuments, nature, and traditions in ${stateName}.`,
      heroImage: heroImage,
    },
  });

  const categorySlug = categoryName.toLowerCase().replace(/\s+/g, "-");
  const category = await prisma.category.upsert({
    where: { slug: categorySlug },
    update: {},
    create: {
      name: categoryName,
      slug: categorySlug,
      description: `${categoryName} experiences across India.`,
    },
  });

  await prisma.touristPlace.upsert({
    where: { slug },
    update: {
      name,
      shortDescription,
      description,
      heroImage,
      bestTimeToVisit,
      entryFee,
      openingTime,
      closingTime,
      address,
      stateId: state.id,
      categoryId: category.id,
      verified: true,
      featured: true,
    },
    create: {
      name,
      slug,
      shortDescription,
      description,
      heroImage,
      bestTimeToVisit,
      entryFee,
      openingTime,
      closingTime,
      address,
      stateId: state.id,
      categoryId: category.id,
      verified: true,
      featured: true,
    },
  });

  revalidatePath("/");
  revalidatePath("/states");
  revalidatePath("/destinations");
  revalidatePath("/admin/dashboard");
  redirect("/admin/dashboard");
}

export async function deleteDestination(destinationId: string) {
  try {
    await prisma.touristPlace.delete({
      where: { id: destinationId },
    });
    revalidatePath("/");
    revalidatePath("/states");
    revalidatePath("/destinations");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (err) {
    return { success: false, error: "Failed to purge record from cluster." };
  }
}