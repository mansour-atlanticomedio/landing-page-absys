"use server";

import { getClient } from "@/lib/payload";

export interface MediaData {
  url: string;
  alt: string;
}

export async function getLoginPageData() {
  try {
    const payload = await getClient();

    const [loginDocs, headerDocs] = await Promise.all([
      payload.find({
        collection: "login_page",
        depth: 2,
        limit: 1,
      }),
      payload.find({
        collection: "header",
        depth: 2,
        limit: 1,
      }),
    ]);

    const loginDoc = loginDocs.docs[0];
    const imageField = loginDoc?.imageLogin;

    const headerDoc = headerDocs.docs[0];
    const logoField = headerDoc?.logo;

    let loginImage: MediaData | null = null;
    if (imageField && typeof imageField === "object") {
      loginImage = {
        url: imageField.url ?? "",
        alt: imageField.alt ?? "Login",
      };
    }

    let headerLogo: MediaData | null = null;
    if (logoField && typeof logoField === "object") {
      headerLogo = {
        url: logoField.url ?? "",
        alt: logoField.alt ?? "Logo",
      };
    }

    return { loginImage, headerLogo };
  } catch (err) {
    console.error("getLoginPageData error:", err);
    return { loginImage: null, headerLogo: null };
  }
}
