import './root.css';
import Menu from './components/menu';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="root-background">
          <div className="menuContainer">
            <div className='system-name'>
              Tuck Shop<br />
              Restocking System
            </div>
            <Menu />
          </div>
          <div className="main-content">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
