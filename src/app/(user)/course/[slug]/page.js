import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'; // Breadcrumb components
import CourseDetail from '@/components/_main/course-detail';

// Static generation with ISR
export const revalidate = 60;

// ✅ Base URL (set once for all fetches)
const baseUrl = process.env.BASE_URL;

// // ✅ Generate all static paths at build
// export async function generateStaticParams() {
//   const res = await fetch(`${baseUrl}/api/courses-slugs`, {
//     next: { revalidate: 3600 }, // Cache slug list for 1 hour
//   });

//   const { data } = await res.json();

//   return (
//     data?.map((product) => ({
//       slug: product.slug,
//     })) || []
//   );
// }

// ✅ Generate metadata per product
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const res = await fetch(`${baseUrl}/api/courses/${slug}`, {
    cache: 'force-cache', // Prefer cached
  });

  const { data: course } = await res.json();

  if (!course) return {};

  return {
    title: course.metaTitle || course.name,
    description: course.metaDescription || course.shortDescription,
    keywords: course.tags || [],
    openGraph: {
      title: course.name,
      description: course.metaDescription,
      images: course?.cover?.url,
    },
  };
}

export default async function CoursesPage({ params }) {
  const { slug } = await params;

  const res = await fetch(`${baseUrl}/api/courses/${slug}`, {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  });

  const { data } = await res.json();

  return (
    <div className='layout-container py-4 md:py-9'>
      <div>
        {/* Page Title */}
        <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold font-merriweather tracking-wide text-foreground mb-2'>
          {data?.title}
        </h1>
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href='/'>Pradžia</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href='/courses'>Kursai</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{decodeURIComponent(data?.title || slug)}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <CourseDetail data={data} />
    </div>
  );
}
