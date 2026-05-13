"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Phone,
  ExternalLink,
  Globe,
  Monitor,
  ArrowLeft,
} from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { THERAPIST_DIRECTORY, CITIES, Therapist } from "@/lib/therapists";

export default function TherapistsPage() {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState<string>("Online");

  const therapists = THERAPIST_DIRECTORY[selectedCity] || [];

  return (
    <main className="min-h-dvh bg-bg-primary pb-safe">
      <div className="w-full max-w-mobile mx-auto px-5 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 rounded-full flex items-center justify-center border border-border hover:bg-bg-card transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-text-secondary" />
          </button>
          <div>
            <h1 className="text-lg font-medium text-text-primary">
              Find a therapist near you
            </h1>
            <p className="text-text-muted text-xs">
              Independent practitioners. AuthRelo is not affiliated.
            </p>
          </div>
        </div>

        {/* City filter */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
          {CITIES.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-pill text-sm transition-all ${
                selectedCity === city
                  ? "bg-accent text-bg-primary font-medium"
                  : "bg-bg-card border border-border text-text-secondary hover:bg-bg-card-hover"
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Therapist cards */}
        <div className="space-y-3">
          {therapists.map((therapist, i) => (
            <ScrollReveal key={therapist.name} delay={i * 0.1}>
              <TherapistCard therapist={therapist} />
            </ScrollReveal>
          ))}
        </div>

        {therapists.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-muted text-sm">
              No listings for this city yet. Try &quot;Online&quot; for remote
              options.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

function TherapistCard({ therapist }: { therapist: Therapist }) {
  const isOnline = therapist.type === "online";
  const isWebsite =
    therapist.contact.includes(".") && !therapist.contact.includes("@");

  return (
    <div className="bg-bg-card border border-border rounded-card p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="text-text-primary text-[15px] font-medium">
            {therapist.name}
          </h3>
          <div className="flex items-center gap-1.5 text-text-muted text-xs">
            <MapPin className="w-3 h-3" />
            {therapist.city}
          </div>
        </div>
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-pill text-xs ${
            isOnline
              ? "bg-accent/10 text-accent"
              : therapist.type === "both"
              ? "bg-success/10 text-success"
              : "bg-blue-500/10 text-blue-400"
          }`}
        >
          {isOnline ? (
            <Globe className="w-3 h-3" />
          ) : therapist.type === "both" ? (
            <Monitor className="w-3 h-3" />
          ) : (
            <MapPin className="w-3 h-3" />
          )}
          {therapist.type === "both"
            ? "Online + In-person"
            : therapist.type === "online"
            ? "Online"
            : "In-person"}
        </div>
      </div>

      <p className="text-text-secondary text-sm">{therapist.speciality}</p>

      <div className="flex items-center gap-2 text-xs text-text-muted">
        <span>Languages:</span>
        {therapist.languages.map((lang) => (
          <span
            key={lang}
            className="bg-bg-primary px-2 py-0.5 rounded-pill border border-border"
          >
            {lang}
          </span>
        ))}
      </div>

      <a
        href={isWebsite ? `https://${therapist.contact}` : `tel:${therapist.contact}`}
        className="flex items-center gap-2 bg-bg-primary border border-border rounded-pill px-4 py-2.5 text-accent text-sm hover:bg-bg-card-hover transition-colors"
      >
        {isWebsite ? (
          <ExternalLink className="w-4 h-4" />
        ) : (
          <Phone className="w-4 h-4" />
        )}
        {therapist.contact}
      </a>
    </div>
  );
}
