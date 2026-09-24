import { supabase } from "./supabase";

export type SiteCampaignConfig = {
  id: string;
  is_active: boolean;
  show_popup: boolean;
  show_home_video: boolean;
};

export const NOX_2027_CAMPAIGN_ID = "nox_2027";

export async function getNox2027Campaign(): Promise<SiteCampaignConfig | null> {
  const { data, error } = await supabase
    .from("site_campaigns")
    .select("id,is_active,show_popup,show_home_video")
    .eq("id", NOX_2027_CAMPAIGN_ID)
    .maybeSingle();

  if (error) throw error;
  return data as SiteCampaignConfig | null;
}

export async function updateNox2027Campaign(
  changes: Partial<Omit<SiteCampaignConfig, "id">>,
) {
  const { data, error } = await supabase
    .from("site_campaigns")
    .update({ ...changes, updated_at: new Date().toISOString() })
    .eq("id", NOX_2027_CAMPAIGN_ID)
    .select("id,is_active,show_popup,show_home_video")
    .single();

  if (error) throw error;
  return data as SiteCampaignConfig;
}
