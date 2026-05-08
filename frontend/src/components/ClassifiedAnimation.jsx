import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Shield, Eye, EyeOff } from 'lucide-react';

const ClassifiedAnimation = ({ show = false, duration = 2000 }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-fbi-black"
        >
          <div className="relative w-full h-full overflow-hidden">
            {/* Scan lines */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] animate-[scan_2s_linear_infinite]" />
            
            {/* Glitch effect */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_49%,rgba(255,0,0,0.1)_50%,transparent_51%)] bg-[length:20px_100%] animate-[glitch_0.3s_steps(2)_infinite]" />
            
            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center space-y-8"
              >
                {/* Shield Icon */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 0.5
                  }}
                  className="w-32 h-32 mx-auto relative"
                >
                  <div className="absolute inset-0 bg-fbi-red/20 rounded-full blur-3xl animate-pulse" />
                  <div className="relative w-full h-full bg-fbi-dark border-2 border-fbi-red rounded-full flex items-center justify-center">
                    <Lock className="w-16 h-16 text-fbi-red" />
                  </div>
                </motion.div>

                {/* Text Animation */}
                <div className="space-y-4">
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-6xl font-bold text-fbi-red tracking-[0.3em] uppercase"
                  >
                    [ CLASSIFIED ]
                  </motion.h1>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center justify-center gap-4"
                  >
                    <motion.div 
                      className="h-[2px] w-20 bg-fbi-red"
                      initial={{ width: 0 }}
                      animate={{ width: 80 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                    />
                    <motion.p 
                      className="text-xl text-gray-400 tracking-[0.5em] uppercase"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                    >
                      Top Secret
                    </motion.p>
                    <motion.div 
                      className="h-[2px] w-20 bg-fbi-red"
                      initial={{ width: 0 }}
                      animate={{ width: 80 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                    />
                  </motion.div>

                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-sm text-gray-600 tracking-[0.2em] uppercase"
                  >
                    Unauthorized Access Prohibited
                  </motion.p>
                </div>

                {/* Decryption animation */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="font-mono text-xs text-fbi-blue/60 tracking-widest"
                >
                  <motion.div
                    animate={{ 
                      textShadow: [
                        '0 0 10px rgba(0,255,255,0.5)',
                        '0 0 20px rgba(0,255,255,0.8)',
                        '0 0 10px rgba(0,255,255,0.5)'
                      ]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    DECRYPTING...
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>

            {/* Corner decorations */}
            <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-fbi-red" />
            <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-fbi-red" />
            <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-fbi-red" />
            <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-fbi-red" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Access Granted Animation
export const AccessGrantedAnimation = ({ show = false, onComplete }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onAnimationComplete={onComplete}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-fbi-black"
        >
          <div className="relative w-full h-full overflow-hidden">
            {/* Scan lines */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] animate-[scan_1s_linear_infinite]" />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center space-y-6"
              >
                {/* Shield Icon */}
                <motion.div
                  initial={{ rotate: -180 }}
                  animate={{ rotate: 0 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="w-24 h-24 mx-auto relative"
                >
                  <div className="absolute inset-0 bg-fbi-blue/20 rounded-full blur-3xl animate-pulse" />
                  <div className="relative w-full h-full bg-fbi-dark border-2 border-fbi-blue rounded-full flex items-center justify-center">
                    <Shield className="w-12 h-12 text-fbi-blue" />
                  </div>
                </motion.div>

                <motion.h1 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl font-bold text-fbi-blue tracking-[0.3em] uppercase"
                >
                  ACCESS GRANTED
                </motion.h1>

                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm text-gray-400 tracking-[0.2em] uppercase"
                >
                  Welcome, Agent
                </motion.p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ClassifiedAnimation;
