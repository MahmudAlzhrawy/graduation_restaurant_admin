    export default function Loading() {
        return (
        <div className="w-full h-screen flex flex-col space-y-4 p-5 bg-gray-100">
            {/* شريط العنوان */}
            <div className="h-10 w-1/3 bg-gray-300 animate-pulse rounded"></div>
            
            {/* بطاقات المحتوى */}
            <div className="space-y-3">
            <div className="h-20 delay-75 bg-gray-300 animate-pulse rounded"></div>
            <div className="h-20 delay-100 bg-gray-300 animate-pulse rounded"></div>
            <div className="h-20 delay-150 bg-gray-300 animate-pulse rounded"></div>
            </div>
        </div>
        );
    }
    