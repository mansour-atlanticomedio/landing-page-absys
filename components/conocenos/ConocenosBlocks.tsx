import { CardsFeaturesSection } from "./CardsFeaturesSection"
import { ImageTextSection } from "./ImageTextSection"
import { ScheduleSection } from "./ScheduleSection"
import { ContactInfoSection } from "./ContactInfoSection"
import { MapSection } from "./MapSection"
import { HelpCtaSection } from "./HelpCtaSection"
import { RulesCardsSection } from "./RulesCardsSection"
import { NoticeSection } from "./NoticeSection"
import { DownloadSection } from "./DownloadSection"

export function ConocenosBlocks({ layout }: { layout?: any[] | null }) {
  const blocks = (layout || []).filter(Boolean)
  const mapUrl: string | undefined = blocks.find((b) => b.blockType === "map_block" && b.map_url)?.map_url

  return (
    <>
      {blocks.map((block, index) => {
        const key = block.id ?? index
        switch (block.blockType) {
          case "cards_features_block":
            return <CardsFeaturesSection key={key} block={block} />
          case "image_text_block":
            return <ImageTextSection key={key} block={block} />
          case "schedule_block":
            return <ScheduleSection key={key} block={block} />
          case "contact_info_block":
            return <ContactInfoSection key={key} block={block} mapUrl={mapUrl} />
          case "map_block":
            return <MapSection key={key} block={block} />
          case "help_cta_block":
            return <HelpCtaSection key={key} block={block} />
          case "rules_cards_block":
            return <RulesCardsSection key={key} block={block} />
          case "notice_block":
            return <NoticeSection key={key} block={block} />
          case "download_block":
            return <DownloadSection key={key} block={block} />
          default:
            return null
        }
      })}
    </>
  )
}
