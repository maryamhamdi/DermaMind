import { getScanHistoryById } from "../../../../features/DermaScan/server/dermaScan.actions";
import ScanReportView from "../../../../features/DermaScan/components/ScanReportView"
export default async function ScanReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let result = null;
  try {
    result = await getScanHistoryById(id);
  } catch (error) {
    console.log(error);
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#D5D5D6]">
        <p className="text-gray-500">Report not found.</p>
      </div>
    );
  }

return (
  <ScanReportView
    diagnosis={{
      ...result.result.top3[0],
      disclaimer: result.result.disclaimer,
      confidence_level: `${result.result.top3[0].confidence}%`,
    }}
    image={result.imageUrl}
  />
);
}


