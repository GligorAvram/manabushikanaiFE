import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AppR } from "@shared/config/constants/routes";

export const isAuthenticatedGuard: CanActivateFn = () => {
    console.log('auth');
  const router = inject(Router);
//   const authSelectors = inject(AuthSelectors);

//   return authSelectors
//     .isAuthenticated()
//     .pipe(
//       map(
//         (isAuthenticated) =>
//           isAuthenticated || router.parseUrl(AppR.auth.login.simple)
//       )
//     );
    return true || router.parseUrl(AppR.dashboard.simple)
};

export const isNotAuthenticatedGuard: CanActivateFn = () => {
  console.log("not auth")
  const router = inject(Router);
//   const authSelectors = inject(AuthSelectors);

//   return authSelectors
//     .isAuthenticated()
//     .pipe(
//       map(
//         (isAuthenticated) =>
//           !isAuthenticated || router.parseUrl(AppR.dashboard.simple)
//       )
//     );
    return false || router.parseUrl(AppR.dashboard.simple);
};
