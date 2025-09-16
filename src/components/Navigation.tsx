import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { observer } from "mobx-react-lite";

interface MenuItem {
  name: string;
  href: string;
  hasDropdown: boolean;
  subItems?: {
    name: string;
    href: string;
  }[];
}
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@heroui/react";
import { Context, type IStoreContext } from "@/store/StoreProvider";
import { 
  MAIN_ROUTE, 
  NEWS_ROUTE, 
  TAGS_ROUTE, 
  NEWS_TYPES_ROUTE,
  PRODUCTS_ROUTE,
  CLOTHING_TYPES_ROUTE,
  COLORS_ROUTE,
  SIZES_ROUTE
} from "@/utils/consts";

export const AdminLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

const Navigation = observer(() => {
  const { user } = useContext(Context) as IStoreContext;
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await user.logout();
    navigate(MAIN_ROUTE);
  };

  const isActiveRoute = (route: string) => {
    return location.pathname === route;
  };

  const adminMenuItems: MenuItem[] = [
    { name: "Главная", href: MAIN_ROUTE, hasDropdown: false },
    { 
      name: "Продукты", 
      href: PRODUCTS_ROUTE, 
      hasDropdown: true,
      subItems: [
        { name: "Все продукты", href: PRODUCTS_ROUTE },
        { name: "Типы одежды", href: CLOTHING_TYPES_ROUTE },
        { name: "Цвета", href: COLORS_ROUTE },
        { name: "Размеры", href: SIZES_ROUTE },
      ]
    },
    { 
      name: "Новости", 
      href: NEWS_ROUTE, 
      hasDropdown: true,
      subItems: [
        { name: "Все новости", href: NEWS_ROUTE },
        { name: "Теги", href: TAGS_ROUTE },
        { name: "Типы новостей", href: NEWS_TYPES_ROUTE },
      ]
    },
  ];

  const userMenuItems = [
    { name: "Профиль", href: "#", action: () => {} },
    { name: "Настройки", href: "#", action: () => {} },
    { name: "Выйти", href: "#", action: handleLogout, color: "danger" },
  ];

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} maxWidth="full" isBordered position="sticky">
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand className="cursor-pointer" onClick={() => navigate(MAIN_ROUTE)}>
          <img src="/LOGO.svg" alt="Logo" className="h-[40px]" />
          <span className="ml-2 text-lg font-bold text-primary">Admin</span>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-6" justify="center">
        {user.isAuth ? (
          adminMenuItems.map((item) => (
            <NavbarItem key={item.name}>
              {item.hasDropdown ? (
                <Dropdown>
                  <DropdownTrigger>
                    <Link 
                      color={isActiveRoute(item.href) ? "primary" : "foreground"}
                      className={`hover:text-primary transition-colors font-medium cursor-pointer ${
                        isActiveRoute(item.href) ? 'text-primary' : ''
                      }`}
                    >
                      {item.name}
                    </Link>
                  </DropdownTrigger>
                  <DropdownMenu aria-label={`${item.name} management`}>
                    {item.subItems?.map((subItem) => (
                      <DropdownItem 
                        key={subItem.name}
                        onClick={() => navigate(subItem.href)}
                      >
                        {subItem.name}
                      </DropdownItem>
                    )) || []}
                  </DropdownMenu>
                </Dropdown>
              ) : (
                <Link 
                  color={isActiveRoute(item.href) ? "primary" : "foreground"}
                  href={item.href}
                  className={`hover:text-primary transition-colors font-medium ${
                    isActiveRoute(item.href) ? 'text-primary' : ''
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(item.href);
                  }}
                >
                  {item.name}
                </Link>
              )}
            </NavbarItem>
          ))
        ) : (
          <NavbarItem>
            <Link 
              color="foreground"
              className="hover:text-primary transition-colors font-medium"
              onClick={(e) => {
                e.preventDefault();
                navigate('/auth');
              }}
            >
              Админ панель
            </Link>
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarContent justify="end">
        {user.isAuth ? (
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <div className="flex items-center gap-2 cursor-pointer hover:bg-default-100 rounded-lg p-2 transition-colors">
                <Avatar
                  size="sm"
                  name={user.user?.username?.charAt(0).toUpperCase() || "A"}
                  className="bg-primary text-white"
                />
                <div className="hidden md:block text-left">
                  <span className="text-sm font-medium">
                    {user.user?.username}
                  </span>
                  <div className="text-xs text-default-500">
                    Администратор
                  </div>
                </div>
              </div>
            </DropdownTrigger>
            <DropdownMenu aria-label="User menu">
              <DropdownItem key="profile" onClick={() => {}}>
                Профиль
              </DropdownItem>
              <DropdownItem key="settings" onClick={() => {}}>
                Настройки
              </DropdownItem>
              <DropdownItem 
                key="logout" 
                className="text-danger" 
                color="danger"
                onClick={handleLogout}
              >
                Выйти
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        ) : (
          <NavbarItem>
            <Button 
              color="primary" 
              variant="flat"
              onClick={() => navigate('/auth')}
            >
              Войти
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarMenu>
        {/* Админские пункты меню */}
        {user.isAuth ? (
          adminMenuItems.map((item) => (
            <NavbarMenuItem key={item.name}>
              <Link
                className="w-full"
                color={isActiveRoute(item.href) ? "primary" : "foreground"}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.href);
                  setIsMenuOpen(false);
                }}
                size="lg"
              >
                {item.name}
              </Link>
              {item.hasDropdown && item.subItems && (
                <div className="ml-4 space-y-2">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.name}
                      className="w-full text-sm text-default-500"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(subItem.href);
                        setIsMenuOpen(false);
                      }}
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </NavbarMenuItem>
          ))
        ) : (
          <NavbarMenuItem>
            <Link
              className="w-full"
              color="foreground"
              onClick={(e) => {
                e.preventDefault();
                navigate('/auth');
                setIsMenuOpen(false);
              }}
              size="lg"
            >
              Админ панель
            </Link>
          </NavbarMenuItem>
        )}
        
        {/* Разделитель */}
        <NavbarMenuItem>
          <div className="w-full h-px bg-default-200 my-2" />
        </NavbarMenuItem>

        {/* Пункты пользователя */}
        {user.isAuth ? (
          userMenuItems.map((item) => (
            <NavbarMenuItem key={item.name}>
              <Link
                className="w-full"
                color={(item.color as "danger") || "foreground"}
                onClick={() => {
                  item.action();
                  setIsMenuOpen(false);
                }}
                size="lg"
              >
                {item.name}
              </Link>
            </NavbarMenuItem>
          ))
        ) : (
          <NavbarMenuItem>
            <Link
              className="w-full"
              color="primary"
              onClick={() => {
                navigate('/auth');
                setIsMenuOpen(false);
              }}
              size="lg"
            >
              Войти
            </Link>
          </NavbarMenuItem>
        )}
      </NavbarMenu>
    </Navbar>
  );
});

export default Navigation;
