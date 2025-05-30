import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LinkPillProps extends React.HTMLAttributes<HTMLDivElement> {
  href?: string;
  children?: React.ReactNode;
  className?: string;
  showIcon?: boolean;
}

export function LinkPill({ 
  href, 
  children = 'Meal Name', 
  className,
  showIcon = true,
  ...props 
}: LinkPillProps = {}) {
  const content = (
    <div 
      className={cn(
        'flex items-center gap-[5px] px-[10px] py-[7px] bg-[#FEFAEE33] border-[0.7px] border-[#FEFAEE80] rounded-full cursor-pointer',
        className
      )}
      {...props}
    >
      {showIcon && (
        <Image 
          src='/assets/smallstar.svg' 
          alt='' 
          width={20} 
          height={20} 
        />
      )}
      <p className="text-[15px] font-medium">{children}</p>
    </div>
  );

  return href ? (
    <Link href={href}>
      {content}
    </Link>
  ) : content;
}
