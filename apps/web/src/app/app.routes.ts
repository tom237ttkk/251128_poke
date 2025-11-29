import { Routes } from "@angular/router";
import { HomeComponent } from "./pages/home.component";
import { LoginComponent } from "./pages/login.component";
import { RegisterComponent } from "./pages/register.component";
import { ProfileComponent } from "./pages/profile.component";
import { OffersComponent } from "./pages/offers.component";
import { OfferDetailComponent } from "./pages/offer-detail.component";
import { SearchComponent } from "./pages/search.component";

export const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "profile", component: ProfileComponent },
  { path: "offers", component: OffersComponent },
  { path: "offers/:id", component: OfferDetailComponent },
  { path: "search", component: SearchComponent },
  { path: "**", redirectTo: "" },
];
