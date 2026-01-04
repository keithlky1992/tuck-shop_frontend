import memberStyles from '@/app/css/member.module.css';

export default function MemberLayout({ children }) {
    return (
        <div className={memberStyles.mainContentContainer}>
            <div>
                {children}
            </div>
        </div>
    )
}