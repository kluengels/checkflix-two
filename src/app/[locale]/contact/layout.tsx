export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // limit container size in second div if needed p.ex. max-w-[1200px]
  return (
    <div className="container mx-auto mb-20 px-8 my-10 flex justify-left">
      <div className="max-w-[800px] w-full mx-auto">{children}</div>
    </div>
  );
}
