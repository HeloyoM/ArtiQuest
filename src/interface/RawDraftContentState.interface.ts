
type CustomBlockType = string
type DraftEntityType = string

type CoreDraftBlockType =
    | "header-one"
    | "header-two"
    | "header-three"
    | "header-four"
    | "header-five"
    | "header-six"
    | "section"
    | "article"
    | "unordered-list-item"
    | "ordered-list-item"
    | "blockquote"
    | "atomic"
    | "code-block"
    | "unstyled";

type DraftBlockType = CoreDraftBlockType | CustomBlockType

type DraftInlineStyleType = "BOLD" | "CODE" | "ITALIC" | "STRIKETHROUGH" | "UNDERLINE";

type DraftEntityMutability = "MUTABLE" | "IMMUTABLE" | "SEGMENTED";

interface RawDraftInlineStyleRange {
    style: DraftInlineStyleType;
    offset: number;
    length: number;
}

interface RawDraftEntityRange {
    key: number;
    offset: number;
    length: number;
}

interface RawDraftEntity<T = { [key: string]: any }> {
    type: DraftEntityType;
    mutability: DraftEntityMutability;
    data: T;
}

interface RawDraftContentBlock {
    key: string;
    type: DraftBlockType;
    text: string;
    depth: number;
    inlineStyleRanges: RawDraftInlineStyleRange[];
    entityRanges: RawDraftEntityRange[];
    data?: { [key: string]: any } | undefined;
}

export interface RawDraftContentState {
    blocks: RawDraftContentBlock[];
    entityMap: { [key: string]: RawDraftEntity };
}
