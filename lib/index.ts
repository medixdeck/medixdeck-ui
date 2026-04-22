/**
 * @medixdeck/ui — Shared UI Component Library
 *
 * Usage:
 * ```tsx
 * import { MedixProvider, Button, Card } from "@medixdeck/ui";
 *
 * function App() {
 *   return (
 *     <MedixProvider defaultColorMode="light">
 *       <Button variant="solid">Talk to a Doctor</Button>
 *     </MedixProvider>
 *   );
 * }
 * ```
 */

// ─── Theme & Provider ──────────────────────────────────────────────────────────
export { MedixProvider } from "./components/provider/MedixProvider";
export type { MedixProviderProps } from "./components/provider/MedixProvider";
export { system, medixConfig } from "./theme";
export { colorTokens } from "./theme/colors";
export { typographyTokens, textStyleTokens } from "./theme/typography";
export { spacingTokens, radiiTokens, shadowTokens } from "./theme/spacing";

// ─── Primitive Components ──────────────────────────────────────────────────────
export { Button } from "./components/primitive/Button";
export type { ButtonProps } from "./components/primitive/Button";

export { IconButton } from "./components/primitive/IconButton";
export type { IconButtonProps } from "./components/primitive/IconButton";

export { Badge } from "./components/primitive/Badge";
export type { BadgeProps, BadgeVariant, BadgeStatus, BadgeSize } from "./components/primitive/Badge";

export { Avatar, AvatarGroup } from "./components/primitive/Avatar";
export type { AvatarProps, AvatarGroupProps, AvatarSize } from "./components/primitive/Avatar";

export { Spinner, FullPageSpinner } from "./components/primitive/Spinner";
export type { SpinnerProps } from "./components/primitive/Spinner";

export { Tag } from "./components/primitive/Tag";
export type { TagProps, TagVariant, TagColorScheme } from "./components/primitive/Tag";

export { Divider } from "./components/primitive/Divider";
export type { DividerProps } from "./components/primitive/Divider";

export { Logo } from "./components/primitive/Logo";
export type { LogoProps, LogoVariant, LogoType } from "./components/primitive/Logo";


// ─── Form Components ───────────────────────────────────────────────────────────
export { Input, SearchInput } from "./components/form/Input";
export type { InputProps, SearchInputProps } from "./components/form/Input";

export { Textarea } from "./components/form/Textarea";
export type { TextareaProps } from "./components/form/Textarea";

export { Select } from "./components/form/Select";
export type { SelectProps, SelectOption } from "./components/form/Select";

export { Checkbox, RadioGroup } from "./components/form/CheckboxRadio";
export type { CheckboxProps, RadioGroupProps, RadioOption } from "./components/form/CheckboxRadio";

export { Switch } from "./components/form/Switch";
export type { SwitchProps } from "./components/form/Switch";

export { FormControl } from "./components/form/FormControl";
export type { FormControlProps } from "./components/form/FormControl";

export { OTPInput, PinInput } from "./components/form/OTPInput";
export type { OTPInputProps, PinInputProps } from "./components/form/OTPInput";

export { PhoneInput } from "./components/form/PhoneInput";
export type { PhoneInputProps } from "./components/form/PhoneInput";

export { DatePicker } from "./components/form/DatePicker";
export type { DatePickerProps } from "./components/form/DatePicker";

export { DateRangePicker } from "./components/form/DateRangePicker";
export type { DateRangePickerProps } from "./components/form/DateRangePicker";

export { Combobox } from "./components/form/Combobox";
export type { ComboboxProps, ComboboxOption } from "./components/form/Combobox";

export { FileUpload } from "./components/form/FileUpload";
export type { FileUploadProps } from "./components/form/FileUpload";

// ─── Layout Components ─────────────────────────────────────────────────────────
export { Card, CardHeader, CardBody, CardFooter } from "./components/layout/Card";
export type { CardProps, CardHeaderProps } from "./components/layout/Card";

export { StatCard } from "./components/layout/StatCard";
export type { StatCardProps } from "./components/layout/StatCard";

export { Container, SectionHeader } from "./components/layout/Container";
export type { ContainerProps, SectionHeaderProps } from "./components/layout/Container";

export { DashboardLayout } from "./components/layout/DashboardLayout";
export type {
  DashboardLayoutProps,
  DashboardNavItem,
  DashboardNavGroup,
  DashboardUser,
  DashboardDropdownItem,
} from "./components/layout/DashboardLayout";

// ─── Navigation Components ─────────────────────────────────────────────────────
export { Navbar } from "./components/navigation/Navbar";
export type { NavbarProps, NavItem } from "./components/navigation/Navbar";

export { Footer } from "./components/layout/Footer";
export type {
  FooterProps,
  FooterSection,
  FooterLink,
  SocialLink,
  NewsletterProps,
  BottomLink,
} from "./components/layout/Footer";

export { Breadcrumb } from "./components/navigation/Breadcrumb";
export type { BreadcrumbProps, BreadcrumbItem } from "./components/navigation/Breadcrumb";

export { Tabs } from "./components/navigation/Tabs";
export type { TabsProps, TabItem } from "./components/navigation/Tabs";

export { Pagination } from "./components/navigation/Pagination";
export type { PaginationProps } from "./components/navigation/Pagination";

export { Stepper } from "./components/navigation/Stepper";
export type { StepperProps, Step } from "./components/navigation/Stepper";

// ─── Feedback & Overlay Components ────────────────────────────────────────────
export { Alert } from "./components/feedback/Alert";
export type { AlertProps, AlertStatus, AlertVariant } from "./components/feedback/Alert";

export { Skeleton, SkeletonText, SkeletonCard } from "./components/feedback/Skeleton";
export type { SkeletonProps, SkeletonTextProps } from "./components/feedback/Skeleton";

export { Progress } from "./components/feedback/Progress";
export type { ProgressProps } from "./components/feedback/Progress";

export { Modal } from "./components/feedback/Modal";
export type { ModalProps, ModalSize } from "./components/feedback/Modal";

export { Tooltip } from "./components/feedback/Tooltip";
export type { TooltipProps } from "./components/feedback/Tooltip";

export { EmptyState } from "./components/feedback/EmptyState";
export type { EmptyStateProps } from "./components/feedback/EmptyState";

export { Drawer } from "./components/feedback/Drawer";
export type { DrawerProps, DrawerPlacement, DrawerSize } from "./components/feedback/Drawer";

export { Toaster, toast, dismissToast } from "./components/feedback/Notification";
export type { ToastOptions, ToastType } from "./components/feedback/Notification";

// ─── Data Display Components ───────────────────────────────────────────────────
export { Accordion } from "./components/data/Accordion";
export type { AccordionProps, AccordionItem } from "./components/data/Accordion";

export { TestimonialCard, BlogCard } from "./components/data/Cards";
export type { TestimonialCardProps, BlogCardProps } from "./components/data/Cards";

export { DataTable } from "./components/data/DataTable";
export type { DataTableProps, Column } from "./components/data/DataTable";


// ─── Healthcare-Specific Components ────────────────────────────────────────────
export {
  DoctorCard,
  VitalBadge,
  AppointmentCard,
} from "./components/healthcare/DoctorCard";
export type {
  DoctorCardProps,
  VitalBadgeProps,
  VitalStatus,
  AppointmentCardProps,
  AppointmentType,
  AppointmentStatus,
} from "./components/healthcare/DoctorCard";

// ─── Re-export useful Chakra UI primitives ─────────────────────────────────────
export {
  Box,
  Flex,
  Grid,
  GridItem,
  Stack,
  VStack,
  HStack,
  SimpleGrid,
  Text,
  Heading,
  Link,
  Image,
  Icon,
  Center,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
