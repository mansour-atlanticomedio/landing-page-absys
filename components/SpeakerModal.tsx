'use client'
import Image from 'next/image';
import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { overlayVariants, modalVariants, cardVariants } from '@/lib/animations'
import { iconsSocialMediaMap } from '@/lib/utils';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from '@radix-ui/react-dialog'
import { useState } from 'react';
import { SpeakersProps } from '@/types/common.type';

export default function SpeakerModal( { photo, name, role, entity, socials, children } : SpeakersProps) {
    const [ isOpen, setIsOpen ] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>

      <DialogTrigger asChild>
        <motion.div
          className="flex flex-col items-center justify-center text-center cursor-pointer group"
          variants={cardVariants}
          whileHover="hover"
          whileTap="tap"
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="relative w-64 h-72 bg-[#f0f4f8] rounded-4xl overflow-hidden mb-6 shadow-sm group-hover:shadow-md transition-shadow">
            <Image
              src={photo.url}
              alt={name}
              fill
              className="object-cover object-top"
            />
          </div>

          <h3 className="text-xl font-bold text-[#1a1c2d] mb-1">{name}</h3>
          <p className="text-gray-600 font-bold text-sm leading-relaxed max-w-55">
            {role}
          </p>
          <p className="text-gray-500 text-sm leading-relaxed max-w-55">
            {entity}
          </p>
        </motion.div>
      </DialogTrigger>

      <AnimatePresence>
        {isOpen && (
          <DialogPortal forceMount>
            <DialogOverlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
                variants={overlayVariants}
                initial="closed"
                animate="open"
                exit={{ opacity: 0 }}
              />
            </DialogOverlay>

            <DialogContent asChild>
              <motion.div
                className="fixed top-1/2 left-1/2 bg-white p-8 rounded-2xl shadow-2xl z-50 w-[95vw] max-w-4xl overflow-hidden"
                variants={modalVariants}
                initial="closed"
                animate="open"
                exit="closed"
                transition={{ type: "spring", duration: 0.5 }}
              >
                <DialogTitle>

                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-accent text-3xl font-bold leading-tight">{name}</h2>
                    <DialogClose className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <X size={24} />
                    </DialogClose>
                  </div>
                </DialogTitle>

                <div className="flex gap-10 max-[700px]:flex-col">
                  <div className="shrink-0">
                    <div className="w-64 h-80 rounded-4xl overflow-hidden shadow-inner">
                      <img className="w-full h-full object-cover object-top" src={photo.url} alt={name} />
                    </div>
                    <div className="flex gap-5 mt-6 justify-center">
                      {
                        socials.map((social, index) => {

                          if (!social?.icon || !social?.url) return null

                          const IconComponent = iconsSocialMediaMap[social.icon]

                          if (!IconComponent) {
                            if (process.env.NODE_ENV === 'development') {
                              console.warn(`⚠️ Icono "${social.icon}" no está registrado en iconMap.`)
                            }
                            return null
                          }

                          const key = social.id || index

                          return (
                            <a key={key}
                              className="text-slate-400 hover:text-blue-600 transition-colors"
                              href={social.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <IconComponent size={22} />
                            </a>
                          )
                        })
                      }
                    </div>
                  </div>

                  <DialogDescription asChild>
                    <div className="prose prose-slate text-gray-600 h-80 max-[700px]:h-32 overflow-y-scroll mask-[linear-gradient(to_bottom,black_90%,transparent_100%)] scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                      {children}
                    </div>
                  </DialogDescription>
                </div>
              </motion.div>
            </DialogContent>
          </DialogPortal>
        )}
      </AnimatePresence>
    </Dialog>
  );
}