import { Fragment } from "react"
import { CardsFeaturesSection } from "@/components/conocenos/CardsFeaturesSection"
import { ImageTextSection } from "@/components/conocenos/ImageTextSection"
import { ScheduleSection } from "@/components/conocenos/ScheduleSection"
import { ContactInfoSection } from "@/components/conocenos/ContactInfoSection"
import { MapSection } from "@/components/conocenos/MapSection"
import { LocationSection } from "@/components/conocenos/LocationSection"
import { HelpCtaSection } from "@/components/conocenos/HelpCtaSection"
import { RulesCardsSection } from "@/components/conocenos/RulesCardsSection"
import { NoticeSection } from "@/components/conocenos/NoticeSection"
import { DownloadSection } from "@/components/conocenos/DownloadSection"
import { FaqSection } from "@/components/conocenos/FaqSection"
import { FaqSearchBox, FaqSearchProvider } from "@/components/conocenos/FaqSearch"

export function RenderPageBlocks({ layout }: { layout?: any[] | null }) {
  const blocks = (layout || []).filter(Boolean)
  const mapUrl: string | undefined = blocks.find((b) => b.blockType === "map_block" && b.map_url)?.map_url

  const faqBlocks = blocks.filter((b) => b.blockType === "faq_section_block" && b.faq && typeof b.faq === "object")
  const hasFaqSearch = faqBlocks.some((b) => b.show_search)
  const firstFaqId = faqBlocks[0]?.id

  const content = (
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
          case "location_block":
            return <LocationSection key={key} block={block} />
          case "help_cta_block":
            return <HelpCtaSection key={key} block={block} />
          case "rules_cards_block":
            return <RulesCardsSection key={key} block={block} />
          case "notice_block":
            return <NoticeSection key={key} block={block} />
          case "download_block":
            return <DownloadSection key={key} block={block} />
          case "faq_section_block":
            return (
              <Fragment key={key}>
                {hasFaqSearch && block.id === firstFaqId && <FaqSearchBox />}
                <FaqSection block={block} />
              </Fragment>
            )
          default:
            return null
        }
      })}
    </>
  )

  if (!hasFaqSearch) return content
  return <FaqSearchProvider docs={faqBlocks.map((b) => (b.faq.faqs ?? []).filter((f: any) => f?.question))}>{content}</FaqSearchProvider>
}
