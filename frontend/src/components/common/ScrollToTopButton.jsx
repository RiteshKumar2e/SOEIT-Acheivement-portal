import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import '../../styles/layout/ScrollToTopButton.css';

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isInFooter, setIsInFooter] = useState(false);

    // Show button when page is scrolled down
    const toggleVisibility = () => {
        // Handle visibility
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }

        // Handle footer theme change
        const footer = document.querySelector('footer');
        if (footer) {
            const footerRect = footer.getBoundingClientRect();
            const buttonPosition = window.innerHeight - 100; // Point where the button is located
            setIsInFooter(footerRect.top <= buttonPosition);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    return (
        <div className={`scroll-to-top ${isVisible ? 'visible' : ''} ${isInFooter ? 'in-footer' : ''}`}>
            <button onClick={scrollToTop} aria-label="Scroll to top">
                <ArrowUp size={20} />
            </button>
        </div>
    );
};

export default ScrollToTopButton;
