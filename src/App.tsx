import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Index = lazy(() => import("./pages/Index"));
const EntryDetail = lazy(() => import("./pages/EntryDetail"));
const NewEntry = lazy(() => import("./pages/NewEntry"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Shared = lazy(() => import("./pages/Shared"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Bookmarks = lazy(() => import("./pages/Bookmarks"));
const BabyHealth = lazy(() => import("./pages/BabyHealth"));
const Wallet = lazy(() => import("./pages/Wallet"));
const Settings = lazy(() => import("./pages/Settings"));
const Insights = lazy(() => import("./pages/Insights"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/entry/:id" element={<EntryDetail />} />
            <Route path="/new" element={<NewEntry />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/shared" element={<Shared />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/baby-health" element={<BabyHealth />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
