"use server";

import prisma from "@/db/prisma";
import { z } from "zod";
import fs from "fs/promises";
import { redirect } from "next/navigation";
const fileSchema = z.instanceof(File, { message: "File must be a file" });
// z.instanceof(File) is a zod schema that checks if the value is an instance of File
// {message: "File must be a file"} is an optional argument that provides a custom error message
// .refine((file) => file.size > 0, 'Required file') is a zod method that checks if the file size is greater than 0
// 'Required file' is a custom error message that will be displayed if the file size is 0

const imageSchema = z
  .instanceof(File, { message: "File must be a file" })
  .refine((file) => file.size === 0 || file.type.startsWith("/image"));

// z.instanceof(File) is a zod schema that checks if the value is an instance of File
// {message: "File must be a file"} is an optional argument that provides a custom error message

// .refine((file) => file.size === 0 || file.type.startsWith('image/')) is a zod method that adds an additional validation check:
// This check ensures that the file is either empty (size 0) or has a type that starts with 'image/' (indicating it's an image file).

// .refine((file) => file.size > 0, 'Required file') is another zod method that adds an additional validation check:
// This check ensures that the file size is greater than 0. If the file size is 0, the custom error message 'Required file' will be displayed.

const addSchema = z.object({
  name: z.string().max(30).min(3),
  description: z.string().max(100).min(10),
  priceInCents: z.coerce.number().int().positive().min(0.99),
  file: fileSchema.refine((file) => file.size > 0, "Required file"),
  image: imageSchema.refine((file) => file.size > 0, "Required file"),
});

export const addProduct = async (formData: FormData) => {
  const res = addSchema.safeParse(Object.fromEntries(formData.entries()));
  console.log(res.error?.message);

  if (!res.success) return res.error.formErrors.fieldErrors;
  const data = res.data;

  // or
  //   const name = formData.get("name") as string;
  //   const priceInCents = formData.get("priceInCents") as string;
  //   const description = formData.get("description") as string;
  //   const file = formData.get("file")
  //   const image = formData.get("image")
  //   const product = {
  //     name,
  //     priceInCents: parseInt(priceInCents),
  //     description,
  //     file,
  //     image,
  //   };
  //   console.log(product);

  await fs.mkdir("products", { recursive: true });
  const filePath = `products${crypto.randomUUID()}-${data.file.name}`;
  await fs.writeFile(filePath, Buffer.from(await data.file.arrayBuffer()));

  await fs.mkdir("public/products", { recursive: true });
  const ImagePath = `/products${crypto.randomUUID()}-${data.image.name}`;
  await fs.writeFile(
    "public" + ImagePath,
    Buffer.from(await data.image.arrayBuffer())
  );
  const addedData = await prisma.product.create({
    data: {
      name: data.name as string,
      description: data.description as string,
      priceInCents: data.priceInCents as number,
      filePath,
      ImagePath,
    },
  });

  redirect('/admin/products');

};
