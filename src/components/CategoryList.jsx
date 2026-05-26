import {Layers2, Pencil} from "lucide-react";

const CategoryList = ({categories, onEditCategory}) => {
    return (
        <div className="card">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold">Category Sources</h4>
            </div>

            {/* Category list */}
            {categories.length === 0 ? (
                <p className="text-slate-400">
                    No categories added yet. Add some to get started
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {categories.map((category) => (
                        <div key={category.id} className="group relative flex items-center gap-4 p-3 rounded-lg hover:bg-slate-800/70">
                            {/* icon/emoji */}
                            <div className="w-12 h-12 flex items-center justify-center text-xl text-slate-100 bg-slate-800 rounded-full">
                                {category.icon ? (
                                    <span className="text-2xl">
                                        <img src={category.icon} alt={category.name} className="h-5 w-5" />
                                    </span>
                                ) : (
                                    <Layers2 className="text-teal-300" size={24} />
                                )}
                            </div>

                            <div className="flex-1 flex items-center justify-between">
                                <p className="text-sm text-slate-100 font-medium">
                                    {category.name}
                                </p>
                                <p className="text-sm text-slate-400 mt-1 capitalize">
                                    {category.type}
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onEditCategory(category)}
                                        className="text-slate-400 hover:text-teal-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default CategoryList;
