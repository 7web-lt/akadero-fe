import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import OrganizerDetail from '@/components/_main/organizer-detail';

// Static generation with ISR
export const revalidate = 60;

// ✅ Base URL (set once for all fetches)
const baseUrl = process.env.BASE_URL;
// ✅ Generate metadata per product
export async function generateMetadata({ params }) {
  const { oid } = await params;
  const res = await fetch(`${baseUrl}/api/organizers/${oid}`, {
    cache: 'force-cache', // Prefer cached
  });

  const { data } = await res.json();

  if (!data) return {};

  return {
    title: data?.organizer?.name || data?.organizer?.name,
    description: data?.organizer?.description || data?.organizer?.description,
    keywords: data?.organizer?.tags || [],
    openGraph: {
      title: data?.organizer?.name,
      description: data?.organizer?.description,
      images: data?.lecturer?.cover?.url,
    },
  };
}

export default async function OrganizersDetailPage({ params }) {
  const { oid } = await params;

  const res = await fetch(`${baseUrl}/api/organizers/${oid}`, {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  });

  const response = await res.json();

  const { data } = await response;
  return (
    <div className='layout-container py-4 md:py-9'>
      <div>
        {/* Page Title */}
        <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold font-merriweather tracking-wide text-foreground mb-2'>
          {data?.organizer?.name}
        </h1>
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/'>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href='/organizers'>Organizers</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{decodeURIComponent(data?.organizer?.name || oid)}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {/* Component */}
      <OrganizerDetail
        data={data?.organizer}
        courses={data?.courses}
      />
    </div>
  );
}
