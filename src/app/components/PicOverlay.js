import picOverlayStyles from '@/app/css/pic-overlay.module.css';

export default function PicOverlay({ children, id }) {
    return (
        <div className={picOverlayStyles.overlay}>
            {children}
        </div>
    );
}