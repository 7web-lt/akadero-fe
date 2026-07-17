import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'; // Breadcrumb components
import CoursesList from '@/components/_main/courses'; // CoursesList components

export const revalidate = 60;
const baseUrl = process.env.BASE_URL;

export async function generateStaticParams() {
  const res = await fetch(`${baseUrl}/api/categories-slugs`, {
    next: { revalidate: 3600 }, // Cache slug list for 1 hour
  });

  const { data } = await res.json();

  return (
    data?.map((cat) => ({
      category: cat.slug,
    })) || []
  );
}

export async function generateMetadata({ params }) {
  const { category } = await params;

  const res = await fetch(`${baseUrl}/api/categories/${category}`, {
    cache: 'force-cache', // Prefer cached
  });

  const { data: currentCategory } = await res.json();

  if (!currentCategory) return {};

  return {
    title: currentCategory.metaTitle || currentCategory.name,
    description: currentCategory.metaDescription || currentCategory.description,
    openGraph: {
      title: currentCategory.name,
      description:
        currentCategory.metaDescription || currentCategory.description,
    },
  };
}

export default async function Page(props) {
  const params = await props.params;
  const { category } = params;

  const res = await fetch(`${baseUrl}/api/categories/${category}`, {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  });

  const response = await res.json();
  if (!response?.success || !response?.data) {
    notFound(); // Show 404 page
  }
  const res2 = await fetch(`${baseUrl}/api/filters/${category}`, {
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  });
  const response2 = await res2.json();
  const { data: categoryData } = response;
  const subCategories = categoryData?.subCategories;
  const { filters } = response2;
  return (
    <div className='layout-container py-4 md:py-9'>
      <div>
        {/* Page Title */}
        <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold font-merriweather tracking-wide text-foreground mb-2'>
          {categoryData?.name}
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
              <BreadcrumbPage>{decodeURIComponent(categoryData?.name || category)}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {/* Courses List Component */}
      <CoursesList
        subCategoriesData={subCategories}
        filters={filters}
        category={categoryData}
      />
    </div>
  );
}
