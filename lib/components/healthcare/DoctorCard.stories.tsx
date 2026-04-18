import type { Meta, StoryObj } from "@storybook/react";
import { DoctorCard, VitalBadge, AppointmentCard } from "./DoctorCard";

const doctorMeta: Meta<typeof DoctorCard> = {
  title: "Healthcare/DoctorCard",
  component: DoctorCard,
  tags: ["autodocs"],
};

export default doctorMeta;
type DoctorStory = StoryObj<typeof DoctorCard>;

export const Default: DoctorStory = {
  args: {
    name: "Dr. Chukwuemeka Okonkwo",
    specialty: "Cardiologist",
    rating: 4.9,
    reviewCount: 342,
    experience: 12,
    location: "Lagos Island General Hospital",
    isAvailable: true,
    onBook: () => alert("Booking Dr. Okonkwo..."),
  },
};

export const Unavailable: DoctorStory = {
  args: { ...Default.args, isAvailable: false, name: "Dr. Fatima Bello" },
};

export const VitalBadgeStory: StoryObj<typeof VitalBadge> = {
  name: "VitalBadge",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <VitalBadge label="Blood Pressure" value="120/80" unit="mmHg" status="normal" />
      <VitalBadge label="Heart Rate" value="102" unit="bpm" status="warning" />
      <VitalBadge label="SpO₂" value="90%" unit="" status="critical" />
    </div>
  ),
};

export const AppointmentCardStory: StoryObj<typeof AppointmentCard> = {
  name: "AppointmentCard",
  render: () => (
    <AppointmentCard
      doctorName="Dr. Okonkwo"
      doctorSpecialty="Cardiologist"
      date="Apr 24, 2026"
      time="10:00 AM"
      type="video"
      status="upcoming"
    />
  ),
};
