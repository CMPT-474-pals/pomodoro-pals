import { useContext } from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { motion, Variants } from 'framer-motion';

// Context
import { StyleContext } from '../contexts/StyleContext';
import { TimerContext } from '../contexts/TimerContext';
import { SoundsContext } from '../contexts/SoundsContext';

// Components
import TimerDisplay from './TimerDisplay';

// Utils
import { convertMinutesToSeconds } from '../utils/helpers';

export default function Timer() {
  const { color } = useContext(StyleContext);
  const { finishedSfx } = useContext(SoundsContext);
  const { isPlaying, resetKey, handleOnComplete, timerDuration, timeOption, updatePomodoroCount } =
    useContext(TimerContext);

  const activeColor: string =
    // eslint-disable-next-line no-nested-ternary
    color === 'red' ? 'F87070' : color === 'cyan' ? '70F3F8' : 'D881F8';

  const convertedDuration = convertMinutesToSeconds(+timerDuration[timeOption]);

  const timerVariants: Variants = {
    initial: { opacity: 0, y: -10 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        ease: 'easeOut',
        duration: 0.3,
      },
    },
  };

  return (
    <motion.div
      initial='initial'
      animate='animate'
      variants={timerVariants}
      className='my-12 ml-auto mr-auto md:w-2/5 h-2/5 md:h-fit flex aspect-square items-center justify-center rounded-full bg-primary-gradient shadow-primary-shadow'
    >
      {/* Mobile Version */}
      <div className='md:hidden flex items-center justify-center rounded-full bg-primary-dark'>
        <CountdownCircleTimer
          key={resetKey}
          rotation='counterclockwise'
          isPlaying={isPlaying}
          duration={convertedDuration}
          colors={`#${activeColor}`}
          trailColor='#161932'
          size={200}
          onComplete={() => {
            handleOnComplete();
            updatePomodoroCount();
            finishedSfx();
          }}
        >
          {({ remainingTime }) => (
            <TimerDisplay remainingTime={remainingTime} />
          )}
        </CountdownCircleTimer>
      </div>

      {/* Tablet and Desktop Version */}
      <div className='hidden md:flex md:items-center md:justify-center md:rounded-full md:bg-primary-dark'>
        <CountdownCircleTimer
          key={resetKey}
          rotation='counterclockwise'
          isPlaying={isPlaying}
          duration={convertedDuration}
          colors={`#${activeColor}`}
          trailColor='#161932'
          size={250}
          onComplete={() => {
            // handleOnComplete();
            // updatePomodoroCount();
            // finishedSfx();
          }}
        >
          {({ remainingTime }) => (
            <TimerDisplay remainingTime={remainingTime} />
          )}
        </CountdownCircleTimer>
      </div>
    </motion.div>
  );
}
