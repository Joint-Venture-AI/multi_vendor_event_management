import express, { Router } from "express";
import { UserRoutes } from "../app/modules/user/user.route";
import { AuthRoutes } from "../app/modules/auth/auth.route";

const router: Router = express.Router();

const apiRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },

];
apiRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
