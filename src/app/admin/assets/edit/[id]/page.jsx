import { getAssetById } from "@/actions/assetActions";
import EditAssetForm from "@/components/EditAssetForm";
import { redirect } from "next/navigation";

// Isse page purana data (cache) nahi dikhayega
export const dynamic = "force-dynamic";

export default async function EditAssetPage({ params }) {
  const { id } = await params;
  
  // DB se purana data la rahe hain
  const asset = await getAssetById(id);

  if (!asset) {
    redirect("/admin/assets/list");
  }

  // Component render ho raha hai
  return <EditAssetForm asset={asset} />;
}