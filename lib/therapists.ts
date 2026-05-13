export interface Therapist {
  name: string;
  city: string;
  speciality: string;
  languages: string[];
  contact: string;
  type: "online" | "in-person" | "both";
}

export const THERAPIST_DIRECTORY: Record<string, Therapist[]> = {
  Mumbai: [
    {
      name: "iCall Psychosocial Helpline",
      city: "Mumbai",
      speciality: "Relationship & emotional distress",
      languages: ["English", "Hindi", "Marathi"],
      contact: "9152987821",
      type: "both",
    },
    {
      name: "Mpower — The Foundation",
      city: "Mumbai",
      speciality: "Couples therapy & individual counselling",
      languages: ["English", "Hindi"],
      contact: "1800-120-820050",
      type: "both",
    },
  ],
  Delhi: [
    {
      name: "Vandrevala Foundation",
      city: "Delhi",
      speciality: "24/7 mental health support",
      languages: ["English", "Hindi"],
      contact: "1860-2662-345",
      type: "both",
    },
    {
      name: "Fortis Mental Health",
      city: "Delhi",
      speciality: "Relationship counselling",
      languages: ["English", "Hindi"],
      contact: "8376804102",
      type: "both",
    },
  ],
  Bangalore: [
    {
      name: "NIMHANS",
      city: "Bangalore",
      speciality: "Clinical psychology & counselling",
      languages: ["English", "Hindi", "Kannada"],
      contact: "080-46110007",
      type: "in-person",
    },
    {
      name: "Parivarthan Counselling",
      city: "Bangalore",
      speciality: "Relationship & family therapy",
      languages: ["English", "Hindi", "Kannada"],
      contact: "7676602602",
      type: "both",
    },
  ],
  Hyderabad: [
    {
      name: "Roshni Trust",
      city: "Hyderabad",
      speciality: "Emotional & relationship support",
      languages: ["English", "Hindi", "Telugu"],
      contact: "040-66202000",
      type: "both",
    },
  ],
  Chennai: [
    {
      name: "Sneha India",
      city: "Chennai",
      speciality: "Emotional support & crisis intervention",
      languages: ["English", "Hindi", "Tamil"],
      contact: "044-24640050",
      type: "both",
    },
  ],
  Kolkata: [
    {
      name: "Lifeline Foundation",
      city: "Kolkata",
      speciality: "Counselling & mental health",
      languages: ["English", "Hindi", "Bengali"],
      contact: "9088030303",
      type: "both",
    },
  ],
  Online: [
    {
      name: "BetterLYF",
      city: "Online",
      speciality: "Online couples & individual therapy",
      languages: ["English", "Hindi"],
      contact: "betterlyf.com",
      type: "online",
    },
    {
      name: "Amaha (formerly InnerHour)",
      city: "Online",
      speciality: "Therapy & self-care",
      languages: ["English", "Hindi"],
      contact: "amaha.co",
      type: "online",
    },
    {
      name: "YourDOST",
      city: "Online",
      speciality: "Online counselling for young adults",
      languages: ["English", "Hindi"],
      contact: "yourdost.com",
      type: "online",
    },
  ],
};

export const CITIES = Object.keys(THERAPIST_DIRECTORY);
