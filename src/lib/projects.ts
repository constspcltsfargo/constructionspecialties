export type ProjectCategory =
  | 'Commercial'
  | 'Education'
  | 'Public'
  | 'Residential'
  | 'Agricultural';

export type Project = {
  src: string;
  title: string;
  category: ProjectCategory;
  location?: string;
};

const dir = '/Website Pics/';

const p = (
  file: string,
  title: string,
  category: ProjectCategory,
  location?: string
): Project => ({ src: dir + file, title, category, location });

export const projects: Project[] = [
  p('Kia 4.jpg', 'Kia Dealership', 'Commercial'),
  p('Ortho 20250629_152250.jpg', 'Orthopedic Clinic', 'Commercial'),
  p('Bismarck School 20250629_144239.jpg', 'Bismarck School', 'Education', 'Bismarck, ND'),
  p('MSU Summer 20250629_182401.jpg', 'MSU Summer Theatre', 'Education', 'Minot, ND'),
  p('ON the Run 20250629_151025.jpg', 'On the Run', 'Commercial'),
  p('IMG_20250630_132808.jpg', 'Fargo Fire Department', 'Public', 'Fargo, ND'),
  p('Big O 2 20250629_173800.jpg', 'Big O Tires', 'Commercial'),
  p('Residential CS LLC.jpg', 'Residential Re-Roof', 'Residential'),
  p('Magic City Car Wash 20250629_182806.jpg', 'Magic City Car Wash', 'Commercial', 'Minot, ND'),
  p('Park Christian School IMG_20250630_122754.jpg', 'Park Christian School', 'Education'),
  p('Minot Airport Fire Station.jpeg', 'Minot Airport Fire Station', 'Public', 'Minot, ND'),
  p('Starbucks 20250629_184403.jpg', 'Starbucks', 'Commercial'),
  p('AT&T 20250629_171749.jpg', 'AT&T & Aspen Dental', 'Commercial'),
  p('Dunn Center IMG_20250630_162752.jpg', 'Dunn Center City Hall', 'Public', 'Dunn Center, ND'),
  p('Edward Jones 2 20250629_172052.jpg', 'Edward Jones', 'Commercial'),
  p('Wachter Middle School.jpg', 'Wachter Middle School', 'Education', 'Bismarck, ND'),
  p('Cenex.jpeg', 'Cenex', 'Commercial'),
  p('Lion Enclosure.jpg', 'Lion Enclosure', 'Public'),
  p('Goodyear Minot 20250629_180407.jpg', 'Goodyear', 'Commercial', 'Minot, ND'),
  p('St Andrews Church.jpeg', "St. Andrew's Church", 'Public'),
  p('IMG_20250630_132041.jpg', 'Multi-Family Residence', 'Residential'),
  p('Underwood 20250629_162111.jpg', 'Underwood School', 'Education', 'Underwood, ND'),
  p('bottineau-county-sheriffs-office.jpg', "Bottineau County Sheriff's Office", 'Public', 'Bottineau, ND'),
  p('Mi Mexico 20250629_172914.jpg', 'Mi Mexico', 'Commercial'),
  p('South Prairie 20250629_170816.jpg', 'South Prairie School', 'Education'),
  p('thumbnail (2).jpg', 'Burlington Northern', 'Commercial'),
  p('TCCUthumbnail (1).jpg', 'Town & Country Center', 'Commercial'),
  p('Minot City Building 20250629_175434.jpg', 'Minot City Building', 'Public', 'Minot, ND'),
  p('MN DL Office 20250629_174244.jpg', 'Driver License Office', 'Public', 'Minot, ND'),
  p('Turtle Lake.png', 'McLean-Sheridan Rural Water', 'Public', 'Turtle Lake, ND'),
  p('MV FARGO.jpg', 'MV Fargo', 'Residential', 'Fargo, ND'),
  p('Tiger Enclosure.jpg', 'Tiger Enclosure', 'Public'),
  p('Black Bldg.jpg', 'Historic Downtown Block', 'Commercial'),
  p('CS Bldg .jpg', 'Brick Warehouse Building', 'Commercial'),
  p('Kia 1.jpg', 'Kia Dealership', 'Commercial'),
  p('Kia 2.jpg', 'Kia Dealership', 'Commercial'),
  p('Ortho 2 20250629_152241.jpg', 'Orthopedic Clinic', 'Commercial'),
  p('Ortho 4 20250629_151426.jpg', 'Orthopedic Clinic', 'Commercial'),
  p('Bismarck School 2.jpg', 'Bismarck School', 'Education', 'Bismarck, ND'),
  p('MSU Summer Theatre 2 20250629_182320.jpg', 'MSU Summer Theatre', 'Education', 'Minot, ND'),
  p('On the Run 2 20250629_150934(1).jpg', 'On the Run', 'Commercial'),
  p('Big O Tire 20250629_173842.jpg', 'Big O Tires', 'Commercial'),
  p('Minot City Car Wash.jpg', 'Magic City Car Wash', 'Commercial', 'Minot, ND'),
  p('Edward Jones 20250629_172208.jpg', 'Edward Jones', 'Commercial'),
  p('Good Year Minot 20250629_180504.jpg', 'Goodyear', 'Commercial', 'Minot, ND'),
  p('Lion 3.jpg', 'Lion Enclosure', 'Public'),
  p('Tiger 2.jpg', 'Tiger Enclosure', 'Public'),
  p('UW 2 20250629_161931.jpg', 'Underwood School', 'Education', 'Underwood, ND'),
  p('UW 3 20250629_161751.jpg', 'Underwood School', 'Education', 'Underwood, ND'),
  p('SP SChool 20250629_170034.jpg', 'South Prairie School', 'Education'),
  p('South Prairie 3.jpg', 'South Prairie School', 'Education'),
  p('Minot City Bldg.jpg', 'Minot City Building', 'Public', 'Minot, ND'),
  p('Minot DOT 2 20250629_174127.jpg', 'Driver License Office', 'Public', 'Minot, ND'),
  p('Minot Lift Station 20250629_183417.jpg', 'Minot Lift Station', 'Public', 'Minot, ND'),
  p('TCCU thumbnail (1).jpg', 'Town & Country Center', 'Commercial'),
];

export const projectCategories: ProjectCategory[] = [
  'Commercial',
  'Education',
  'Public',
  'Residential',
  'Agricultural',
];

/** A varied selection for the home page — one photo per building. */
export const featuredProjects: Project[] = projects.slice(0, 16);

const byFile = (fileStart: string) =>
  projects.find((x) => x.src.startsWith(dir + fileStart))!;

export const imageFor = (fileStart: string) => byFile(fileStart).src;

export const heroSlides: Project[] = [
  byFile('Kia 4'),
  byFile('Bismarck School 2025'),
  byFile('Ortho 2025'),
  byFile('MSU Summer 2025'),
  byFile('Big O 2'),
];
