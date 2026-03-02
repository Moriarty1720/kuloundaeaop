import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, ChevronLeft, MapPin, Search, Shield, Users, Bot } from 'lucide-react';

interface TutorialStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export default function TutorialModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [currentStep, setCurrentStep] = React.useState(0);

  const steps: TutorialStep[] = [
    {
      title: "Bem-vindo ao KULONDA",
      description: "A plataforma humanitária dedicada a encontrar pessoas desaparecidas em Angola. Juntos, somos mais fortes.",
      icon: <Shield size={48} />,
      color: "bg-primary"
    },
    {
      title: "Registe um Caso",
      description: "Se tem um familiar desaparecido, crie um registo detalhado com fotos e localização para alertar a comunidade.",
      icon: <Users size={48} />,
      color: "bg-danger"
    },
    {
      title: "Reporte Avistamentos",
      description: "Viu alguém que se parece com um dos casos activos? Reporte o avistamento no mapa para ajudar nas investigações.",
      icon: <MapPin size={48} />,
      color: "bg-secondary"
    },
    {
      title: "Pesquisa Inteligente",
      description: "Utilize os nossos filtros avançados para encontrar casos por província, idade ou data de desaparecimento.",
      icon: <Search size={48} />,
      color: "bg-accent"
    },
    {
      title: "Assistente KULO AI",
      description: "O nosso assistente virtual está disponível 24/7 para tirar dúvidas e dar orientações sobre os primeiros passos.",
      icon: <Bot size={48} />,
      color: "bg-success"
    }
  ];

  const next = () => {
    if (currentStep < steps.length - 1) setCurrentStep(s => s + 1);
    else onClose();
  };

  const prev = () => {
    if (currentStep > 0) setCurrentStep(s => s - 1);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-primary/40 backdrop-blur-md"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
            >
              <X size={24} className="text-gray-400" />
            </button>

            <div className="flex-grow">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-12 text-center"
                >
                  <div className={`w-24 h-24 ${steps[currentStep].color} text-white rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-xl`}>
                    {steps[currentStep].icon}
                  </div>
                  <h2 className="font-display font-extrabold text-3xl text-primary mb-4">
                    {steps[currentStep].title}
                  </h2>
                  <p className="text-gray-500 leading-relaxed">
                    {steps[currentStep].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="p-8 bg-gray-50 flex items-center justify-between">
              <div className="flex gap-2">
                {steps.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      currentStep === i ? 'w-8 bg-primary' : 'w-2 bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-3">
                {currentStep > 0 && (
                  <button 
                    onClick={prev}
                    className="p-3 border border-gray-200 rounded-2xl text-gray-500 hover:bg-white transition-colors"
                  >
                    <ChevronLeft size={24} />
                  </button>
                )}
                <button 
                  onClick={next}
                  className="bg-primary text-white font-bold px-8 py-3 rounded-2xl shadow-lg hover:bg-accent transition-all flex items-center gap-2"
                >
                  {currentStep === steps.length - 1 ? 'Começar Agora' : 'Próximo'}
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
