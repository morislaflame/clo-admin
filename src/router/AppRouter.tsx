import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { publicRoutes, privateRoutes } from '@/router/routes';
import { MAIN_ROUTE, AUTH_ROUTE } from '@/utils/consts';
import { Context, type IStoreContext } from '@/store/StoreProvider';

const AppRouter = () => {
    const { user } = useContext(Context) as IStoreContext;

    return (
        <Routes>
            {/* Публичные маршруты доступны всем */}
            {publicRoutes.map(({ path, Component }) => (
                <Route key={path} path={path} element={<Component />} />
            ))}

            {/* Приватные маршруты только для авторизованных */}
            {user.isAuth ? (
                privateRoutes.map(({ path, Component }) => (
                    <Route key={path} path={path} element={<Component />} />
                ))
            ) : (
                // Если пользователь не авторизован, перенаправляем на страницу авторизации
                privateRoutes.map(({ path }) => (
                    <Route key={path} path={path} element={<Navigate to={AUTH_ROUTE} />} />
                ))
            )}

            {/* Если пользователь авторизован и пытается зайти на страницу авторизации, перенаправляем на главную */}
            <Route 
                path={AUTH_ROUTE} 
                element={user.isAuth ? <Navigate to={MAIN_ROUTE} /> : <Navigate to={AUTH_ROUTE} />} 
            />

            <Route path="*" element={<Navigate to={user.isAuth ? MAIN_ROUTE : AUTH_ROUTE} />} />
        </Routes>
    );
};

export default AppRouter;
