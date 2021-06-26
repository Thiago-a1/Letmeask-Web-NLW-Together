import { ButtonHTMLAttributes } from 'react';

import '../styles/button.scss';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	isOutlined?: boolean;
	isExclud?: boolean
};

export function Button({ isOutlined = false, isExclud = false, ...props }: ButtonProps) {
	return (
		<button 
			className={`button ${isOutlined ? 'outlined': ''} ${isExclud ? 'exclud' : ''}`} 
			{...props}
		/>
	)
}