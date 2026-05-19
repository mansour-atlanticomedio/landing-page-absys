import { RichText } from '@payloadcms/richtext-lexical/react'
import SpeakerModal from './SpeakerModal';
import { SpeakersProps } from '@/types/common.type';

interface SpeakersBoxProps {
  title: string,
  people: SpeakersProps[]
}

export default function Speakers({ title, people }: SpeakersBoxProps) {

  return (
    <div className="min-h-screen bg-white font-sans mx-10 md:p-8 flex flex-col justify-center items-center">
      <div className="flex flex-col items-center mb-16">
        <div className="flex items-center gap-3">
          <h2 className="section-title">{title}</h2>
        </div>
      </div>

      <div className="w-full max-w-8xl flex flex-wrap justify-around items-center mb-10 gap-y-4">
        {people.map((person, index) => (
          <SpeakerModal key={index} {...person} >
            <RichText data={person.description} />
          </SpeakerModal>
        ))}
      </div>
    </div>
  );
};